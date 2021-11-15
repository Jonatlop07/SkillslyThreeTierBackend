abstract class UserAccountException extends Error {}

class UserAccountAlreadyExistsException extends UserAccountException {}

class UserAccountInvalidDataFormatException extends UserAccountException {}

class UserAccountNotFoundException extends UserAccountException {}

class UserAccountInvalidCredentialsException extends UserAccountException {}

export {
  UserAccountException,
  UserAccountAlreadyExistsException,
  UserAccountInvalidDataFormatException,
  UserAccountNotFoundException,
  UserAccountInvalidCredentialsException
};
