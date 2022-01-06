import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class ServiceRequestException extends CoreException {}

class InvalidServiceRequestDetailsFormatException extends ServiceRequestException {
  code = CoreExceptionCodes.INVALID_SERVICE_REQUEST_DETAILS_FORMAT;
  message = 'The details of the service request are in an invalid format';
}

class NonExistentServiceRequestException extends ServiceRequestException {
  code = CoreExceptionCodes.NON_EXISTENT_SERVICE_REQUEST;
  message = 'The service request does not exist';
}

class InvalidPhaseToDeleteServiceRequestException extends ServiceRequestException {
  code = CoreExceptionCodes.INVALID_PHASE_TO_DELETE_SERVICE_REQUEST;
  message = 'You can not delete the service request while in the current phase';
}

export {
  ServiceRequestException,
  InvalidServiceRequestDetailsFormatException,
  NonExistentServiceRequestException,
  InvalidPhaseToDeleteServiceRequestException
};
