abstract class GetProfileException extends Error {
}

class GetProfileInvalidDataFormatException extends GetProfileException {
}

export {
  GetProfileException,
  GetProfileInvalidDataFormatException,
};