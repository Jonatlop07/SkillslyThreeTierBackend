abstract class CreateUserAccountException extends Error {}

class CreateUserAccountInvalidDataFormatException extends CreateUserAccountException {}

class CreateUserAccountAlreadyExistsException extends CreateUserAccountException {}

export {
  CreateUserAccountException,
  CreateUserAccountInvalidDataFormatException,
  CreateUserAccountAlreadyExistsException
};
