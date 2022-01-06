export class ServiceRequestDITokens {
  public static readonly CreateServiceRequestInteractor: unique symbol = Symbol('CreateServiceRequestInteractor');
  public static readonly UpdateServiceRequestInteractor: unique symbol = Symbol('UpdateServiceRequestInteractor');
  public static readonly DeleteServiceRequestInteractor: unique symbol = Symbol('DeleteServiceRequestInteractor');
  public static readonly ServiceRequestRepository: unique symbol = Symbol('ServiceRequestRepository');
}
