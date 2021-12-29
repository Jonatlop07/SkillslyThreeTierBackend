export class ServiceOfferDITokens {
  public static readonly CreateServiceOfferInteractor: unique symbol = Symbol('CreateServiceOfferInteractor');
  public static readonly UpdateServiceOfferInteractor: unique symbol = Symbol('UpdateServiceOfferInteractor');
  public static readonly DeleteServiceOfferInteractor: unique symbol = Symbol('DeleteServiceOfferInteractor');
  public static readonly QueryServiceOfferCollectionInteractor: unique symbol = Symbol('QueryServiceOfferCollectionInteractor');
  public static readonly ServiceOfferRepository: unique symbol = Symbol('ServiceOfferRepository');
}
