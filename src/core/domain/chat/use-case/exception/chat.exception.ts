abstract class ChatException extends Error {}

class NonExistentConversationChatException extends ChatException {}

class NoMembersInConversationChatException extends ChatException {}

class EmptyMessageChatException extends ChatException {}

class UserDoesNotBelongToConversationChatException extends ChatException {}

class SimpleConversationAlreadyExistsChatException extends ChatException {}

export {
  ChatException,
  NonExistentConversationChatException,
  NoMembersInConversationChatException,
  EmptyMessageChatException,
  UserDoesNotBelongToConversationChatException,
  SimpleConversationAlreadyExistsChatException
};
