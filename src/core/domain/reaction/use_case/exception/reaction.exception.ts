abstract class ReactionException extends Error {}

class AddReactionUnexistingPostException extends ReactionException {}

class AddReactionInvalidTypeException extends ReactionException {}

export {
  ReactionException,
  AddReactionUnexistingPostException,
  AddReactionInvalidTypeException
};
