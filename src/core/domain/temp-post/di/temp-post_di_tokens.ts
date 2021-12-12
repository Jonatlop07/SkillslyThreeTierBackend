export class TempPostDITokens {
  public static readonly CreateTempPostInteractor: unique symbol = Symbol('CreateTempPostInteractor');
  public static readonly QueryTemporalPostInteractor: unique symbol = Symbol('QueryTemporalPostInteractor');
  public static readonly QueryTemporalPostCollectionInteractor: unique symbol = Symbol('QueryTemporalPostCollectionInteractor');
  public static readonly DeleteTemporalPostInteractor: unique symbol = Symbol('DeleteTemporalPostInteractor');
  public static readonly TempPostRepository: unique symbol = Symbol('TempPostRepository');
}