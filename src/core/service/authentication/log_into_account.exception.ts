abstract class LogIntoAccountException extends Error {}

class LogIntoAccountInvalidCredentialsException extends LogIntoAccountException {}

class LogIntoAccountNonExistentException extends LogIntoAccountException {}

export {
  LogIntoAccountException,
  LogIntoAccountInvalidCredentialsException,
  LogIntoAccountNonExistentException
};
