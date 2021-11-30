import { CoreExceptionCodes } from "@core/common/exception/core_exception_codes";

abstract class UserAccountException extends Error {}

class UserAccountAlreadyExistsException extends UserAccountException {}

class UserAccountInvalidDataFormatException extends UserAccountException {}

class UserAccountNotFoundException extends UserAccountException {
  code = CoreExceptionCodes.NON_EXISTENT_USER;
  message = 'The user does not exists';
}

class UserAccountInvalidCredentialsException extends UserAccountException {}

export {
  UserAccountException,
  UserAccountAlreadyExistsException,
  UserAccountInvalidDataFormatException,
  UserAccountNotFoundException,
  UserAccountInvalidCredentialsException
};
