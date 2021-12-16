import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class PermanentPostException extends CoreException {}

class EmptyPermanentPostContentException extends PermanentPostException {
  code = CoreExceptionCodes.EMPTY_POST_CONTENT;
  message= 'Empty post content';
}

class NonExistentPermanentPostException extends PermanentPostException {
  code = CoreExceptionCodes.NON_EXISTENT_POST;
  message = 'The post does not exist';
}

class NonExistentUserException extends PermanentPostException {
  code = CoreExceptionCodes.NON_EXISTENT_POST_OWNER;
  message = 'The post owner does not exist';
}

export {
  PermanentPostException,
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException,
  NonExistentUserException
};
