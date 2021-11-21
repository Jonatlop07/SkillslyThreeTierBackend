abstract class CommentException extends Error {
}

class CommentInvalidDataFormatException extends CommentException {
}

class ThereAreNoCommentsException extends CommentException {
}

export {
  CommentException,
  CommentInvalidDataFormatException,
  ThereAreNoCommentsException,
};