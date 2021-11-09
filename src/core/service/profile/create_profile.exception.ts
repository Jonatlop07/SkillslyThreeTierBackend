abstract class CreateProfileException extends Error {
}

class CreateProfileInvalidDataFormatException extends CreateProfileException {
}

export {
  CreateProfileException,
  CreateProfileInvalidDataFormatException,
};