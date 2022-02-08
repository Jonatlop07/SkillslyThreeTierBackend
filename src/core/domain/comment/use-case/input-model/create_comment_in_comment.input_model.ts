export default interface CreateCommentInCommentInputModel {
  commentID?: string;
  ancestorCommentID: string;
  userID: string;
  comment: string;
  timestamp: string;
}