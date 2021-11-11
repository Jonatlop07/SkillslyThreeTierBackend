export class PostDITokens {
  public static readonly CreatePermanentPostInteractor: unique symbol = Symbol(
    'CreatePermanentPostInteractor',
  );
  public static readonly PermanentPostRepository: unique symbol =
    Symbol('PostRepository');
}
