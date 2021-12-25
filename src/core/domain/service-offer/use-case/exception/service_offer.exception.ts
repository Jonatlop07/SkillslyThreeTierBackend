import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class ServiceOfferException extends CoreException {}

class InvalidServiceOfferDetailsFormatException extends ServiceOfferException {
  code = CoreExceptionCodes.INVALID_SERVICE_OFFER_DETAILS_FORMAT;
  message = 'The details of the service offer are in an invalid format';
}

export {
  ServiceOfferException,
  InvalidServiceOfferDetailsFormatException
};
