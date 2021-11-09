abstract class PermanentPostException extends Error {}

class EmptyPermanentPostContentException extends PermanentPostException {}

class NonExistentPermanentPostException extends PermanentPostException {}

class UnauthorizedPermanentPostContentException extends PermanentPostException {}

export {
  PermanentPostException,
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException,
  UnauthorizedPermanentPostContentException
};
