import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class EventException extends CoreException {}

class EmptyEventDescriptionException extends EventException {
  code = CoreExceptionCodes.EMPTY_EVENT_DESCRIPTION_OR_NAME;
  message= 'Empty event description or name';
}

class EventNotFoundException extends EventException {
  code = CoreExceptionCodes.NON_EXISTENT_EVENT;
  message= 'Event not found';
}

class EventAssistantNotFoundException extends EventException {
  code = CoreExceptionCodes.NON_EXISTENT_EVENT_ASSISTANT;
  message= 'Event assistant not found';
}

export {
  EventException,
  EmptyEventDescriptionException,
  EventNotFoundException,
  EventAssistantNotFoundException
};
