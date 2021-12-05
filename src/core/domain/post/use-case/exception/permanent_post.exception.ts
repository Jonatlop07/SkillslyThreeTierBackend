import { CoreException } from '@core/common/exception/core.exception';

abstract class PermanentPostException extends CoreException {}

class EmptyPermanentPostContentException extends PermanentPostException {
  code = 200;
  message= 'Empty post content';
}

class NonExistentPermanentPostException extends PermanentPostException {
  code = 201;
  message = 'The post does not exist';
}

class NonExistentUserException extends PermanentPostException {
  code = 202;
  message = 'The post owner does not exist';
}

export {
  PermanentPostException,
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException,
  NonExistentUserException
};
