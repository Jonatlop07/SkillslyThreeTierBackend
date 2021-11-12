abstract class UserAccountException extends Error {}

class UserAccountInvalidDataFormatException extends UserAccountException {}

class UserNotFoundException extends UserAccountException {}

export {
  UserAccountException,
  UserAccountInvalidDataFormatException,
  UserNotFoundException
};
