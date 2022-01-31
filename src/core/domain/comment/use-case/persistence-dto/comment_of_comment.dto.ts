export interface CommentOfCommentDTO{
  comment_id?: string;
  comment: string;
  timestamp: string;
  userID?: string;
  ancestorCommentID?: string;
}