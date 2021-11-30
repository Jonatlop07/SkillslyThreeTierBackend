import { CoreException } from '@core/common/exception/core.exception';
import { CoreExceptionCodes } from '@core/common/exception/core_exception_codes';

abstract class ReactionException extends CoreException {}

class AddReactionUnexistingPostException extends ReactionException {
  code = CoreExceptionCodes.NON_EXISTENT_POST;
  message = 'Can not react to a post that does not exist';
}

class AddReactionInvalidTypeException extends ReactionException {
  code = CoreExceptionCodes.INVALID_REACTION_TYPE;
  message = 'Invalid reaction type';
}

class QueryReactionsUnexistingPostException extends ReactionException{
  code = CoreExceptionCodes.NON_EXISTENT_POST;
  message = 'Can not get the reactions from a post that does not exist';
}

export {
  ReactionException,
  AddReactionUnexistingPostException,
  AddReactionInvalidTypeException,
  QueryReactionsUnexistingPostException
};
