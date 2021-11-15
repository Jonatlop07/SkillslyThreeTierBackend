abstract class PermanentPostException extends Error {}

class EmptyPermanentPostContentException extends PermanentPostException {}

class NonExistentPermanentPostException extends PermanentPostException {}

class NonExistentUserException extends PermanentPostException {}

export {
  PermanentPostException,
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException,
  NonExistentUserException
};
