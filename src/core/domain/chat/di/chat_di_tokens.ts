export class ChatDITokens {
  public static readonly CreatePrivateChatConversationInteractor: unique symbol = Symbol('CreatePrivateChatConversationInteractor');
  public static readonly CreateGroupChatConversationInteractor: unique symbol = Symbol('CreateGroupChatConversationInteractor');
  public static readonly GetChatConversationCollectionInteractor: unique symbol = Symbol('GetChatConversationCollectionInteractor');
  public static readonly GetChatMessageCollectionInteractor: unique symbol = Symbol('GetChatMessageCollectionInteractor');
  public static readonly CreateChatMessageInteractor: unique symbol = Symbol('CreateChatMessageInteractor');
  public static readonly ChatConversationRepository: unique symbol = Symbol('ChatConversationRepository');
  public static readonly ChatMessageRepository: unique symbol = Symbol('ChatMessageRepository');
}
