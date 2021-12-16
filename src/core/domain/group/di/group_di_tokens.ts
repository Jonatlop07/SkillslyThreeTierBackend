export class GroupDITokens {
  public static readonly CreateGroupInteractor: unique symbol = Symbol('CreateGroupInteractor');
  public static readonly UpdateGroupInteractor: unique symbol = Symbol('UpdateGroupInteractor');
  public static readonly DeleteGroupInteractor: unique symbol = Symbol('DeleteGroupInteractor');
  public static readonly CreateJoinGroupRequestInteractor: unique symbol = Symbol('CreateJoinGroupRequestInteractor');
  public static readonly DeleteJoinGroupRequestInteractor: unique symbol = Symbol('DeleteJoinGroupRequestInteractor');
  public static readonly UpdateGroupUserInteractor: unique symbol = Symbol('UpdateGroupUserInteractor');
  public static readonly LeaveGroupInteractor: unique symbol = Symbol('LeaveGroupInteractor');
  public static readonly QueryGroupInteractor: unique symbol = Symbol('QueryGroupInteractor');
  public static readonly QueryGroupCollectionInteractor: unique symbol = Symbol('QueryGroupCollectionInteractor');
  public static readonly GetJoinRequestsInteractor: unique symbol = Symbol('GetJoinRequestsInteractor');
  public static readonly QueryGroupUsersInteractor: unique symbol = Symbol('QueryGroupUsersInteractor');
  public static readonly GroupRepository: unique symbol = Symbol('GroupRepository');
}
