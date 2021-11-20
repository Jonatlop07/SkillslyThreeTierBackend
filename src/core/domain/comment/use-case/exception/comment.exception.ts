abstract class CommentException extends Error {
}

class CommentInvalidDataFormatException extends CommentException {
}

export {
  CommentException,
  CommentInvalidDataFormatException,
};