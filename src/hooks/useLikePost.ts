import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../api/posts";
import type { Post, PostsData } from "../types/api";
import { postKeys } from "./queryKeys";

/**
 * Toggle like on a post with optimistic update.
 *
 * Immediately flips `isLiked` / `likesCount` in the cache, then reconciles
 * with the server response. Rolls back on error.
 *
 * @example
 * const { mutate: toggleLike } = useLikePost();
 * toggleLike({ postId: "post_1", currentIsLiked: post.isLiked });
 */
export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId }: { postId: string; currentIsLiked: boolean }) =>
      likePost(postId),

    onMutate: async ({ postId, currentIsLiked }) => {
      // Cancel any in-flight refetches for this post
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      // Snapshot current cache value for rollback
      const previousPost = queryClient.getQueryData<Post>(
        postKeys.detail(postId),
      );

      // Optimistic update — detail cache
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !currentIsLiked,
          likesCount: currentIsLiked ? old.likesCount - 1 : old.likesCount + 1,
        };
      });

      // Optimistic update — list caches (all pages)
      queryClient.setQueriesData<{ pages: PostsData[] }>(
        { queryKey: postKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              posts: page.posts.map((p) =>
                p.id === postId
                  ? {
                      ...p,
                      isLiked: !currentIsLiked,
                      likesCount: currentIsLiked
                        ? p.likesCount - 1
                        : p.likesCount + 1,
                    }
                  : p,
              ),
            })),
          };
        },
      );

      return { previousPost };
    },

    onSuccess: (likeData, { postId }) => {
      // Reconcile with the authoritative server count
      queryClient.setQueryData<Post>(postKeys.detail(postId), (old) => {
        if (!old) return old;
        return { ...old, ...likeData };
      });
    },

    onError: (_err, { postId }, context) => {
      // Roll back the detail cache
      if (context?.previousPost) {
        queryClient.setQueryData(postKeys.detail(postId), context.previousPost);
      }
      // Invalidate lists so they refetch clean data
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
