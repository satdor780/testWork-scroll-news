import { useQuery } from "@tanstack/react-query";
import { getPost } from "../api/posts";
import { postKeys } from "./queryKeys";

/**
 * Fetch a single post by id.
 *
 * @example
 * const { data: post, isLoading } = usePost("post_1");
 */
export function usePost(id: string) {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => getPost(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });
}
