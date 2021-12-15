import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class ProjectException extends CoreException {}

class EmptyProjectContentException extends ProjectException {
  code = CoreExceptionCodes.EMPTY_PROJECT_CONTENT;
  message = 'Empty project content';
}

class NonExistentProjectException extends ProjectException {
  code = CoreExceptionCodes.NON_EXISTENT_PROJECT;
  message = 'The project does not exist';
}

class NonExistentUserException extends ProjectException {
  code = CoreExceptionCodes.NON_EXISTENT_PROJECT_OWNER;
  message = 'The project owner does not exist';
}

export {
  ProjectException,
  EmptyProjectContentException,
  NonExistentProjectException,
  NonExistentUserException,
};
