import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { OnlyOwnerLeavingGroupException } from '@core/domain/group/use-case/exception/group.exception';
import LeaveGroupInputModel from '@core/domain/group/use-case/input-model/leave_group.input_model';
import LeaveGroupOutputModel from '@core/domain/group/use-case/output-model/leave_group.output_model';
import LeaveGroupGateway from '@core/domain/group/use-case/gateway/leave_group.gateway';
import { LeaveGroupInteractor } from '@core/domain/group/use-case/interactor/leave_group.interactor';

export class LeaveGroupService implements LeaveGroupInteractor{
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: LeaveGroupGateway
  ){}

  async execute(
    input: LeaveGroupInputModel,
  ): Promise<LeaveGroupOutputModel> {
    const { user_id, group_id } = input;
    const user_is_owner = await this.gateway.userIsOwner({ group_id: group_id, user_id: user_id });
    if (user_is_owner){
      const not_only_owner = await this.gateway.groupHasMoreOwners( group_id );
      if (not_only_owner){
        return await this.gateway.leaveGroup({ user_id: user_id, group_id: group_id }) as LeaveGroupOutputModel;
      } else {
        throw new OnlyOwnerLeavingGroupException();
      }
    }   
    return await this.gateway.leaveGroup({ user_id: user_id, group_id: group_id }) as LeaveGroupOutputModel;
  }
}
