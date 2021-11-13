abstract class EditProfileException extends Error {
}

class EditInputEmptyException extends EditProfileException {
}

export {
  EditProfileException,
  EditInputEmptyException,
};