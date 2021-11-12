export class PostDITokens {
  public static readonly CreatePermanentPostInteractor: unique symbol = Symbol(
    'CreatePermanentPostInteractor',
  );

  public static readonly QueryPermanentPostCollectionInteractor: unique symbol = Symbol(
    'QueryPermanentPostCollectionInteractor',
  );
  public static readonly QueryPermanentPostInteractor: unique symbol = Symbol(
    'QueryPermanentPostCollectionInteractor',
  );

  public static readonly UpdatePermanentPostInteractor: unique symbol = Symbol(
    'UpdatePermanentPostInteractor',
  );
  public static readonly PermanentPostRepository: unique symbol =
    Symbol('PermanentPostRepository');
}
