import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import {
  UnauthorizedGroupEditorException, UnexistentJoinGroupRequestException,
} from '@core/domain/group/use-case/exception/group.exception';
import { UpdateGroupUserInteractor } from '@core/domain/group/use-case/interactor/join-request/update_group_user.interactor';
import UpdateGroupUserGateway from '@core/domain/group/use-case/gateway/join-request/update_group_user.gateway';
import UpdateGroupUserInputModel from '@core/domain/group/use-case/input-model/join-request/update_group_user.input_model';
import UpdateGroupUserOutputModel from '@core/domain/group/use-case/output-model/join-request/update_group_user.output_model';

export class UpdateGroupUserService
implements UpdateGroupUserInteractor {
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: UpdateGroupUserGateway,
  ) {}

  async execute(
    input: UpdateGroupUserInputModel,
  ): Promise<UpdateGroupUserOutputModel> {
    const { owner_id, user_id, group_id, action } = input;
    const isOwner = await this.gateway.userIsOwner({ user_id: owner_id, group_id: group_id });
    if (!isOwner){
      throw new UnauthorizedGroupEditorException();
    }
    const existing_follow_request = await this.gateway.existsJoinRequest({ user_id: user_id, group_id: group_id });
    if (!existing_follow_request && (action === 'accept' || action === 'reject')){
      throw new UnexistentJoinGroupRequestException;
    }
    if (action === 'accept'){
      return await this.gateway.acceptUserJoinGroupRequest({ user_id: user_id, group_id: group_id }) as UpdateGroupUserOutputModel;  
    } else if ( action === 'reject'){
      return await this.gateway.rejectUserJoinGroupRequest({ user_id: user_id, group_id: group_id }) as UpdateGroupUserOutputModel; 
    } else if ( action === 'remove'){
      return await this.gateway.removeUserFromGroup({ user_id: user_id, group_id: group_id });
    }
  }
}
