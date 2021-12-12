export class ChatDITokens {
  public static readonly CreatePrivateChatConversationInteractor: unique symbol = Symbol('CreatePrivateChatConversationInteractor');
  public static readonly CreateGroupChatConversationInteractor: unique symbol = Symbol('CreateGroupChatConversationInteractor');
  public static readonly AddMembersToGroupConversationInteractor: unique symbol = Symbol('AddMembersToGroupConversationInteractor');
  public static readonly GetChatConversationCollectionInteractor: unique symbol = Symbol('GetChatConversationCollectionInteractor');
  public static readonly UpdateGroupConversationDetailsInteractor: unique symbol = Symbol('UpdateGroupConversationDetailsInteractor');
  public static readonly DeleteChatGroupConversationInteractor: unique symbol = Symbol('DeleteChatGroupConversationInteractor');
  public static readonly GetChatMessageCollectionInteractor: unique symbol = Symbol('GetChatMessageCollectionInteractor');
  public static readonly CreateChatMessageInteractor: unique symbol = Symbol('CreateChatMessageInteractor');
  public static readonly ChatConversationRepository: unique symbol = Symbol('ChatConversationRepository');
  public static readonly ChatMessageRepository: unique symbol = Symbol('ChatMessageRepository');
}
