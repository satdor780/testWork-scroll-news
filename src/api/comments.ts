import { apiClient } from "../lib/apiClient";
import type {
  AddCommentBody,
  ApiOk,
  Comment,
  CommentCreatedData,
  CommentsData,
  GetCommentsParams,
} from "../types/api";

// ─── GET /posts/:id/comments ──────────────────────────────────────────────────

export async function getComments(
  postId: string,
  params: GetCommentsParams = {},
): Promise<CommentsData> {
  const { data } = await apiClient.get<ApiOk<CommentsData>>(
    `/posts/${postId}/comments`,
    { params },
  );
  return data.data;
}

// ─── POST /posts/:id/comments ─────────────────────────────────────────────────

export async function addComment(
  postId: string,
  body: AddCommentBody,
): Promise<Comment> {
  const { data } = await apiClient.post<ApiOk<CommentCreatedData>>(
    `/posts/${postId}/comments`,
    body,
  );
  return data.data.comment;
}
