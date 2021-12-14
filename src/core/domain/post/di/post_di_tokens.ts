export class PostDITokens {
  public static readonly CreatePermanentPostInteractor: unique symbol = Symbol('CreatePermanentPostInteractor');
  public static readonly UpdatePermanentPostInteractor: unique symbol = Symbol('UpdatePermanentPostInteractor');
  public static readonly DeletePermanentPostInteractor: unique symbol = Symbol('DeletePermanentPostInteractor');
  public static readonly PermanentPostRepository: unique symbol = Symbol('PermanentPostRepository');
  public static readonly QueryPermanentPostInteractor: unique symbol = Symbol('QueryPermanentPostInteractor');
  public static readonly QueryPermanentPostCollectionInteractor: unique symbol = Symbol('QueryPermanentPostCollectionInteractor');
  public static readonly SharePermanentPostInteractor: unique symbol = Symbol('SharePermanentPostInteractor');
  public static readonly GetPermanentPostCollectionOfFriendsInteractor: unique symbol = Symbol('GetPermanentPostCollectionOfFriendsInteractor');
}
