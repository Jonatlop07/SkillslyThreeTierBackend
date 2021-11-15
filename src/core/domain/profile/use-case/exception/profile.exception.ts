abstract class ProfileException extends Error {}

class ProfileInvalidDataFormatException extends ProfileException {}

class ProfileEditEmptyInputException extends ProfileException {}

class ProfileNotFoundException extends ProfileException {}

export {
  ProfileException,
  ProfileInvalidDataFormatException,
  ProfileEditEmptyInputException,
  ProfileNotFoundException,
};
