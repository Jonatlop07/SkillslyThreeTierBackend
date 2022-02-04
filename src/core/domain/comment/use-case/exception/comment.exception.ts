import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class CommentException extends CoreException {}

class CommentInvalidDataFormatException extends CommentException {
  code = CoreExceptionCodes.INVALID_FORMAT_COMMENT_DATA;
  message = 'Invalid comment data format';
}

export {
  CommentException,
  CommentInvalidDataFormatException
};
