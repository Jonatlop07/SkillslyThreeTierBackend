export class PostDITokens {
  public static readonly CreatePermanentPostInteractor: unique symbol = Symbol(
    'CreatePermanentPostInteractor',
  );
  public static readonly UpdatePermanentPostInteractor: unique symbol = Symbol(
    'UpdatePermanentPostInteractor',
  );
  public static readonly PostRepository: unique symbol =
    Symbol('PostRepository');
}
