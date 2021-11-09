abstract class CreatePermanentPostException extends Error {}

class CreatePermanentPostEmptyContentException extends CreatePermanentPostException {}

export {
  CreatePermanentPostException,
  CreatePermanentPostEmptyContentException,
};
