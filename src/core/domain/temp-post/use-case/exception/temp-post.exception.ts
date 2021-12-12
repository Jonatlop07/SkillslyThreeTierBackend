import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class TempPostException extends CoreException {
}

class InvalidInputException extends TempPostException {
  code = CoreExceptionCodes.REQUIRED_TEMP_POST_CONTENT;
  message = 'Data is missing for create a temporal post';
}

class InvalidReferenceException extends TempPostException {
  code = CoreExceptionCodes.INVALID_TEMP_POST_REFERENCE;
  message = 'Invalid reference for temporal post';
}

class InvalidReferenceTypeException extends TempPostException {
  code = CoreExceptionCodes.INVALID_TEMP_POST_REFERENCE_TYPE;
  message = 'Invalid reference type for temporal post';
}

class NotFoundTemporalPostException extends TempPostException {
  code = CoreExceptionCodes.NOT_FOUND_TEMP_POST;
  message = 'Temporal post not found';
}

export {
  InvalidInputException,
  InvalidReferenceException,
  InvalidReferenceTypeException,
  NotFoundTemporalPostException,
  TempPostException,
};