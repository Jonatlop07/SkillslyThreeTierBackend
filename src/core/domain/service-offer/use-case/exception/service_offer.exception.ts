import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class ServiceOfferException extends CoreException {}

class InvalidServiceOfferDetailsFormatException extends ServiceOfferException {
  code = CoreExceptionCodes.INVALID_SERVICE_OFFER_DETAILS_FORMAT;
  message = 'The details of the service offer are in an invalid format';
}

class NonExistentServiceOfferException extends ServiceOfferException {
  code = CoreExceptionCodes.NON_EXISTENT_SERVICE_OFFER;
  message = 'The service offer does not exist';
}

class ServiceOfferDoesNotBelongToUserException extends ServiceOfferException {
  code = CoreExceptionCodes.SERVICE_OFFER_DOES_NOT_BELONG_TO_USER;
  message = 'Cannot update a service offer that does not belong to you';
}

export {
  ServiceOfferException,
  InvalidServiceOfferDetailsFormatException,
  NonExistentServiceOfferException,
  ServiceOfferDoesNotBelongToUserException
};
