abstract class UserAccountException extends Error {}

class UserAccountInvalidDataFormatException extends UserAccountException {}

export {
  UserAccountException,
  UserAccountInvalidDataFormatException
};