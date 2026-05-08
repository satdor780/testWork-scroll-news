import { useInfiniteQuery } from "@tanstack/react-query";
import { getPosts } from "../api/posts";
import type { GetPostsParams, PostsData } from "../types/api";
import { postKeys } from "./queryKeys";

interface UsePostsOptions extends Omit<GetPostsParams, "cursor"> {
  enabled?: boolean;
}

/**
 * Infinite-scroll feed of posts.
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts({ tier: "free" });
 * const posts = data?.pages.flatMap((p) => p.posts) ?? [];
 */
export function usePosts({ enabled = true, ...params }: UsePostsOptions = {}) {
  return useInfiniteQuery<PostsData, Error>({
    queryKey: postKeys.list(params),
    queryFn: ({ pageParam }) =>
      getPosts({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
    enabled,
    staleTime: 1000 * 60, // 1 min
  });
}
