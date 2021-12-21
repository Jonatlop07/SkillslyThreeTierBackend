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

class PrivateConversationAlreadyExistsChatException extends ChatException {
  code = CoreExceptionCodes.PRIVATE_CONVERSATION_ALREADY_EXISTS_CHAT;
  message = 'The chat conversation already exists';
}

class InvalidGroupConversationDetailsFormatChatException extends ChatException {
  code = CoreExceptionCodes.INVALID_GROUP_CONVERSATION_DETAILS_FORMAT;
  message = 'The edited details of the group conversation are in an invalid format';
}

class UserDoesNotHavePermissionsInConversationChatException extends ChatException {
  code = CoreExceptionCodes.USER_DOES_NOT_HAVE_PERMISSIONS_IN_CONVERSATION;
  message = 'The user is not an administrator of the conversation';
}

export {
  ChatException,
  NonExistentConversationChatException,
  NoMembersInConversationChatException,
  EmptyMessageChatException,
  UserDoesNotBelongToConversationChatException,
  PrivateConversationAlreadyExistsChatException,
  InvalidGroupConversationDetailsFormatChatException,
  UserDoesNotHavePermissionsInConversationChatException
};
