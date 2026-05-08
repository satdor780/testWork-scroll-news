import type { GetPostsParams } from "../types/api";

/**
 * Centralised query key factory.
 * Keeps all cache keys in one place so invalidations are never magic strings.
 *
 * Usage:
 *   queryClient.invalidateQueries({ queryKey: postKeys.detail(id) })
 */
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (params: GetPostsParams) => [...postKeys.lists(), params] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
};

export const commentKeys = {
  all: ["comments"] as const,
  lists: () => [...commentKeys.all, "list"] as const,
  list: (postId: string) => [...commentKeys.lists(), postId] as const,
};
