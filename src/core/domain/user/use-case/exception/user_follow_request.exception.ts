import { CoreExceptionCodes } from "@core/common/exception/core_exception_codes";

abstract class UserFollowRequestException extends Error {}

class UserFollowRequestAlreadyExistsException extends UserFollowRequestException {
  code = CoreExceptionCodes.USER_FOLLOW_REQUEST_ALREADY_EXISTS;
  message = 'The follow request already exists';
}

export {
  UserFollowRequestException,
  UserFollowRequestAlreadyExistsException
}