abstract class GetProfileException extends Error {
}

class ProfileNotExistsException extends GetProfileException {
}

export {
  GetProfileException,
  ProfileNotExistsException,
};