import { CoreException } from "@core/common/exception/core.exception";
import { CoreExceptionCodes } from "@core/common/exception/core_exception_codes";

abstract class EventException extends CoreException {}

class EmptyEventDescriptionException extends EventException {
  code = CoreExceptionCodes.EMPTY_EVENT_DESCRIPTION_OR_NAME;
  message= 'Empty event description or name';
}

export {
  EventException,
  EmptyEventDescriptionException
}