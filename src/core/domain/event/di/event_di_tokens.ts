export class EventDITokens {
  public static readonly EventRepository: unique symbol = Symbol('EventRepository');
  public static readonly CreateEventInteractor: unique symbol = Symbol('CreateEventInteractor');
  public static readonly GetEventCollectionOfFriendsInteractor: unique symbol = Symbol('GetEventCollectionOfFriendsInteractor');
  public static readonly GetMyEventCollectionInteractor: unique symbol = Symbol('GetMyEventCollectionInteractor');
  public static readonly CreateEventAssistantInteractor: unique symbol = Symbol('CreateEventAssistantInteractor');
  public static readonly GetEventAssistantCollectionInteractor: unique symbol = Symbol('GetEventAssistantCollectionInteractor');
  public static readonly DeleteEventAssistantInteractor: unique symbol = Symbol('DeleteEventAssistantInteractor');
  public static readonly UpdateEventInteractor: unique symbol = Symbol('UpdateEventInteractor');
  public static readonly DeleteEventInteractor: unique symbol = Symbol('DeleteEventInteractor');
  public static readonly GetMyEventAssistantCollectionInteractor: unique symbol = Symbol('GetMyEventAssistantCollectionInteractor');

}
