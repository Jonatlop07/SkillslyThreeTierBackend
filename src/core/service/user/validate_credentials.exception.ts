abstract class ValidateCredentialsException extends Error {}

class ValidateCredentialsInvalidCredentialsException extends ValidateCredentialsException {}

class ValidateCredentialsNonExistentAccountException extends ValidateCredentialsException {}

export {
  ValidateCredentialsException,
  ValidateCredentialsInvalidCredentialsException,
  ValidateCredentialsNonExistentAccountException
};
