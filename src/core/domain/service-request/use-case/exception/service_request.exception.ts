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

class InvalidServiceRequestPhaseOperationException extends ServiceRequestException {
  code = CoreExceptionCodes.UNAUTHORIZED_SERVICE_REQUEST_APPLICATION_ACTION;
  message = 'You can not perform this actions in the current service request phase';
}

class NonExistentServiceRequestApplicationException extends ServiceRequestException {
  code = CoreExceptionCodes.NON_EXISTENT_SERVICE_REQUEST_APPLICATION;
  message = 'The service request application does not exist';
}

class AlreadyExistingStatusUpdateRequestException extends ServiceRequestException {
  code = CoreExceptionCodes.SERVICE_REQUEST_STATUS_UPDATE_REQUEST_ALREADY_EXISTS;
  message = 'A request to complete or cancel the service already exists';
}

class NonExistentStatusUpdateRequestException extends ServiceRequestException {
  code = CoreExceptionCodes.NON_EXISTENT_SERVICE_REQUEST_STATUS_UPDATE_REQUEST;
  message = 'A request to complete or cancel the service does not exists';
}

export {
  ServiceRequestException,
  InvalidServiceRequestDetailsFormatException,
  NonExistentServiceRequestException,
  InvalidPhaseToDeleteServiceRequestException,
  InvalidServiceRequestPhaseOperationException,
  NonExistentServiceRequestApplicationException,
  AlreadyExistingStatusUpdateRequestException, 
  NonExistentStatusUpdateRequestException
};
