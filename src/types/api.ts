// ─── Primitives ──────────────────────────────────────────────────────────────

export type PostTier = "free" | "paid";

// ─── Entities ────────────────────────────────────────────────────────────────

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  /** Full text. Empty string for paid posts. */
  body: string;
  /** Short preview up to 120 chars */
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  /** Whether the current user liked this post */
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ─── Request params ───────────────────────────────────────────────────────────

export interface GetPostsParams {
  limit?: number;
  cursor?: string;
  tier?: PostTier;
  /** Pass true to simulate a 500 for error-handling tests */
  simulate_error?: boolean;
}

export interface GetCommentsParams {
  limit?: number;
  cursor?: string;
}

export interface AddCommentBody {
  text: string;
}

// ─── Raw API response shapes ──────────────────────────────────────────────────
// These mirror the server JSON exactly. Consumers should use the typed helpers
// in api/ instead of working with these directly.

export interface ApiOk<T> {
  ok: true;
  data: T;
}

export interface ApiError {
  ok: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiOk<T> | ApiError;

// ─── Response data bags ───────────────────────────────────────────────────────

export interface PostsData {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PostDetailData {
  post: Post;
}

export interface LikeData {
  isLiked: boolean;
  likesCount: number;
}

export interface CommentsData {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentCreatedData {
  comment: Comment;
}
