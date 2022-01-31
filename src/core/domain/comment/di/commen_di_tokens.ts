export class CommentDITokens {
  public static readonly CreateCommentInPermanentPostInteractor: unique symbol = Symbol('CreateCommentInPermanentPostInteractor');
  public static readonly GetCommentsInPermamentPostInteractor: unique symbol = Symbol('GetCommentsInPermamentPostInteractor');
  public static readonly CreateCommentInCommentInteractor: unique symbol = Symbol('CreateCommentInCommentInteractor');
  public static readonly CommentRepository: unique symbol = Symbol('CommentRepository');
  public static readonly CommentInCommentRepository: unique symbol = Symbol('CommentInCommentRepository');
}