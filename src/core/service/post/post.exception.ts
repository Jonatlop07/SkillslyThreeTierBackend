abstract class PostException extends Error {}

class EmptyPermanentPostContentException extends PostException {}

class NonExistentPermanentPostException extends PostException {}

class UnauthorizedPermanentPostContentException extends PostException {}

export {
  PostException,
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException,
  UnauthorizedPermanentPostContentException
};
