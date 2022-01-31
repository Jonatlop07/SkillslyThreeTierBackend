import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';
import { CoreException } from '@core/common/exception/core.exception';

abstract class ProfileException extends CoreException {}

class ProfileInvalidDataFormatException extends ProfileException {
  code = CoreExceptionCodes.INVALID_FORMAT_PROFILE_DATA;
  message= 'The details of the profile are in an invalid format';
}

class ProfileEditEmptyInputException extends ProfileException {
  code = CoreExceptionCodes.PROFILE_EMPTY_DETAILS;
  message= 'Empty profile input';
}

class ProfileNotFoundException extends ProfileException {
  code = CoreExceptionCodes.NOT_FOUND_PROFILE;
  message= 'User does not have a profile';
}

export {
  ProfileException,
  ProfileInvalidDataFormatException,
  ProfileEditEmptyInputException,
  ProfileNotFoundException,
};
