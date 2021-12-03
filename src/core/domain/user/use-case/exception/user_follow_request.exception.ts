import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class UserFollowRequestException extends Error {}

class UserFollowRequestAlreadyExistsException extends UserFollowRequestException {
  code = CoreExceptionCodes.USER_FOLLOW_REQUEST_ALREADY_EXISTS;
  message = 'The follow request already exists';
}

class UserFollowRequestNotFoundException extends UserFollowRequestException {
  code = CoreExceptionCodes.NON_EXISTENT_USER_FOLLOW_REQUEST;
  message = 'The follow request does not exists';
}

class UserFollowRequestInvalidDataFormatException extends UserFollowRequestException {
  code = CoreExceptionCodes.INVALID_FORMAT_USER_FOLLOW_REQUEST;
  message = 'The follow request has invalid format';
}

class UserFollowRelationshipNotFoundException extends UserFollowRequestException {
  code = CoreExceptionCodes.NON_EXISTENT_USER_FOLLOW_RELATIONSHIP;
  message = 'The follow relationship does not exists';
}

export {
  UserFollowRequestException,
  UserFollowRequestAlreadyExistsException, 
  UserFollowRequestNotFoundException,
  UserFollowRequestInvalidDataFormatException, 
  UserFollowRelationshipNotFoundException
};