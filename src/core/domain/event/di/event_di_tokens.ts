export class EventDITokens {
  public static readonly EventRepository: unique symbol = Symbol('EventRepository');
  public static readonly CreateEventInteractor: unique symbol = Symbol('CreateEventInteractor');
  public static readonly GetEventCollectionOfFriendsInteractor: unique symbol = Symbol('GetEventCollectionOfFriendsInteractor');
  public static readonly GetMyEventCollectionInteractor: unique symbol = Symbol('GetMyEventCollectionInteractor');
}
