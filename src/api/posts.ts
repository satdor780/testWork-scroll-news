import { apiClient } from "../lib/apiClient";
import type {
  ApiOk,
  GetPostsParams,
  LikeData,
  Post,
  PostDetailData,
  PostsData,
} from "../types/api";

// ─── GET /posts ───────────────────────────────────────────────────────────────

export async function getPosts(
  params: GetPostsParams = {},
): Promise<PostsData> {
  const { data } = await apiClient.get<ApiOk<PostsData>>("/posts", { params });
  return data.data;
}

// ─── GET /posts/:id ───────────────────────────────────────────────────────────

export async function getPost(id: string): Promise<Post> {
  const { data } = await apiClient.get<ApiOk<PostDetailData>>(`/posts/${id}`);
  return data.data.post;
}

// ─── POST /posts/:id/like ─────────────────────────────────────────────────────

export async function likePost(id: string): Promise<LikeData> {
  const { data } = await apiClient.post<ApiOk<LikeData>>(`/posts/${id}/like`);
  return data.data;
}
