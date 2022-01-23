import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';
import { CoreException } from '@core/common/exception/core.exception';

abstract class UserAccountException extends CoreException {}

class UserAccountAlreadyExistsException extends UserAccountException {
  code = CoreExceptionCodes.ACCOUNT_ALREADY_EXISTS;
  message = 'Tried to create an account that already exists';
}

class UserAccountInvalidDataFormatException extends UserAccountException {
  code = CoreExceptionCodes.INVALID_ACCOUNT_DATA_FORMAT;
  message = 'Invalid account data format';
}

class UserAccountNotFoundException extends UserAccountException {
  code = CoreExceptionCodes.NON_EXISTENT_USER;
  message = 'The user does not exists';
}

class UserAccountInvalidCredentialsException extends UserAccountException {
  code = CoreExceptionCodes.INVALID_CREDENTIALS;
  message = 'Provided invalid credentials';
}

class NoSpecialRoleToObtainException extends UserAccountException {
  code = CoreExceptionCodes.NO_SPECIAL_ROLE_TO_OBTAIN;
  message = 'No special roles to obtain were provided';
}

class UserAlreadyHasSpecialRolesException extends UserAccountException {
  code = CoreExceptionCodes.USER_ALREADY_HAS_SPECIAL_ROLES;
  message = 'User is already investor and requester';
}

class UserAlreadyHasRequesterRoleException extends UserAccountException {
  code = CoreExceptionCodes.USER_ALREADY_HAS_REQUESTER_ROLE;
  message = 'User is already requester';
}

class UserAlreadyHasInvestorRoleException extends UserAccountException {
  code = CoreExceptionCodes.USER_ALREADY_HAS_INVESTOR_ROLE;
  message = 'User is already investor';
}

export {
  UserAccountException,
  UserAccountAlreadyExistsException,
  UserAccountInvalidDataFormatException,
  UserAccountNotFoundException,
  UserAccountInvalidCredentialsException,
  NoSpecialRoleToObtainException,
  UserAlreadyHasSpecialRolesException,
  UserAlreadyHasRequesterRoleException,
  UserAlreadyHasInvestorRoleException
};
