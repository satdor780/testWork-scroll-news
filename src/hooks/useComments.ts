import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../api/comments";
import type { CommentsData, GetCommentsParams } from "../types/api";
import { commentKeys } from "./queryKeys";

interface UseCommentsOptions extends Omit<GetCommentsParams, "cursor"> {
  enabled?: boolean;
}

/**
 * Paginated comments for a post.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage } = useComments("post_1");
 * const comments = data?.pages.flatMap((p) => p.comments) ?? [];
 */
export function useComments(
  postId: string,
  { enabled = true, ...params }: UseCommentsOptions = {},
) {
  return useInfiniteQuery<CommentsData, Error>({
    queryKey: commentKeys.list(postId),
    queryFn: ({ pageParam }) =>
      getComments(postId, {
        ...params,
        cursor: pageParam as string | undefined,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled: enabled && Boolean(postId),
    staleTime: 1000 * 30, // 30 sec — comments go stale faster
  });
}
