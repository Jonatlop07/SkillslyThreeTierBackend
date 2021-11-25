export class ChatDITokens {
  public static readonly CreateSimpleChatConversationInteractor: unique symbol = Symbol('CreateSimpleChatConversationInteractor');
  public static readonly CreateGroupChatConversationInteractor: unique symbol = Symbol('CreateGroupChatConversationInteractor');
  public static readonly CreateChatMessageInteractor: unique symbol = Symbol('CreateChatMessageInteractor');
  public static readonly ChatConversationRepository: unique symbol = Symbol('ChatConversationRepository');
  public static readonly ChatMessageRepository: unique symbol = Symbol('ChatMessageRepository');
}
