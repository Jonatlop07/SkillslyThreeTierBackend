export default interface CreateCommentInPermanentPostInputModel {
  commentID?: string;
  userID: string;
  postID: string;
  comment: string;
  timestamp: string;
}