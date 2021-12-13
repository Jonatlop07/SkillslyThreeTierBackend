import { CoreException } from '@core/common/exception/core.exception';

abstract class GroupException extends CoreException {}

class InvalidGroupInfoException extends GroupException {
  code = 800;
  message= 'The group information must have at least a name, a description and a category';
}

class UnauthorizedGroupEditorException extends GroupException{
  code = 801;
  message = 'The user has to be an owner of the group to perform these actions';
}

class JoinGroupRequestAlreadyExistsException extends GroupException{
  code = 802;
  message = 'A join request to the group already exists or the user already belongs to the group';
}

class UnexistentJoinGroupRequestException extends GroupException{
  code = 803;
  message = 'A join request to the group does not exist';
}

class OnlyOwnerLeavingGroupException extends GroupException{
  code = 804;
  message = 'An owner can\'t leave the group if the group doesn\'t have any more owners';  
}

class UnexistentGroupException extends GroupException{
  code = 805;
  message = 'The group to be queried does not exist';
}

export {
  GroupException,
  InvalidGroupInfoException,
  UnauthorizedGroupEditorException,
  JoinGroupRequestAlreadyExistsException,
  UnexistentJoinGroupRequestException,
  OnlyOwnerLeavingGroupException,
  UnexistentGroupException
};
