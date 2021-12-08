import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class ChatException extends CoreException {}

class NonExistentConversationChatException extends ChatException {
  code = CoreExceptionCodes.NON_EXISTENT_CONVERSATION_CHAT;
  message = 'The conversation does not exists';
}

class NoMembersInConversationChatException extends ChatException {
  code = CoreExceptionCodes.NO_MEMBERS_IN_CONVERSATION_CHAT;
  message = 'No members of the conversation were provided';
}

class EmptyMessageChatException extends ChatException {
  code = CoreExceptionCodes.EMPTY_MESSAGE_CHAT;
  message = 'The content of the messages cannot be empty';
}

class UserDoesNotBelongToConversationChatException extends ChatException {
  code = CoreExceptionCodes.USER_DOES_NOT_BELONG_TO_CONVERSATION_CHAT;
  message = 'You do not belong to the conversation';
}

class SimpleConversationAlreadyExistsChatException extends ChatException {
  code = CoreExceptionCodes.SIMPLE_CONVERSATION_ALREADY_EXISTS_CHAT;
  message = 'The chat conversation already exists';
}

export {
  ChatException,
  NonExistentConversationChatException,
  NoMembersInConversationChatException,
  EmptyMessageChatException,
  UserDoesNotBelongToConversationChatException,
  SimpleConversationAlreadyExistsChatException
};
