import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addComment } from "../api/comments";
import type { Comment, CommentsData } from "../types/api";
import { commentKeys, postKeys } from "./queryKeys";

/**
 * Add a comment to a post.
 *
 * - Appends the new comment optimistically to the first page.
 * - Increments `commentsCount` on the post detail cache.
 * - Rolls back both on error.
 *
 * @example
 * const { mutate: submit, isPending } = useAddComment("post_1");
 * submit({ text: "Отличный пост!" });
 */
export function useAddComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { text: string }) => addComment(postId, body),

    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.list(postId) });

      const previousComments = queryClient.getQueryData<{
        pages: CommentsData[];
      }>(commentKeys.list(postId));

      // Optimistic comment with a temporary id
      const optimistic: Comment = {
        id: `optimistic-${Date.now()}`,
        postId,
        author: {} as Comment["author"], // will be replaced by server response
        text: body.text,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<{ pages: CommentsData[] }>(
        commentKeys.list(postId),
        (old) => {
          if (!old) return old;
          const [firstPage, ...rest] = old.pages;
          return {
            ...old,
            pages: [
              {
                ...firstPage,
                comments: [optimistic, ...(firstPage?.comments ?? [])],
              },
              ...rest,
            ],
          };
        },
      );

      return { previousComments };
    },

    onSuccess: (newComment) => {
      // Replace the optimistic entry with the real server comment
      queryClient.setQueryData<{ pages: CommentsData[] }>(
        commentKeys.list(postId),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, i) =>
              i === 0
                ? {
                    ...page,
                    comments: page.comments.map((c) =>
                      c.id.startsWith("optimistic-") ? newComment : c,
                    ),
                  }
                : page,
            ),
          };
        },
      );

      // Bump the commentsCount on the post detail
      queryClient.setQueryData<{ commentsCount: number }>(
        postKeys.detail(postId),
        (old) => {
          if (!old) return old;
          return { ...old, commentsCount: old.commentsCount + 1 };
        },
      );
    },

    onError: (_err, _vars, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          commentKeys.list(postId),
          context.previousComments,
        );
      }
    },
  });
}
