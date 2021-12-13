import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import {
  JoinGroupRequestAlreadyExistsException,
} from '@core/domain/group/use-case/exception/group.exception';
import { CreateJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/create_join_group_request.interactor';
import CreateJoinGroupRequestGateway from '@core/domain/group/use-case/gateway/join-request/create_join_group_request.gateway';
import CreateJoinGroupRequestInputModel from '@core/domain/group/use-case/input-model/join-request/create_join_group_request.input_model';
import CreateJoinGroupRequestOutputModel from '@core/domain/group/use-case/output-model/join-request/create_join_group_request.output_model';

export class CreateJoinGroupRequestService
implements CreateJoinGroupRequestInteractor {
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: CreateJoinGroupRequestGateway,
  ) {}

  async execute(
    input: CreateJoinGroupRequestInputModel,
  ): Promise<CreateJoinGroupRequestOutputModel> {
    const { user_id, group_id } = input;
    const user_is_owner = await this.gateway.userIsOwner({
      group_id: group_id,
      user_id: user_id,
    });
    const request_exists = await this.gateway.existsJoinRequest({
      group_id: group_id,
      user_id: user_id,
    });
    const user_already_joined = await this.gateway.existsGroupUserRelationship({
      group_id: group_id,
      user_id: user_id,
    });
    if (request_exists || user_already_joined || user_is_owner) {
      throw new JoinGroupRequestAlreadyExistsException();
    }
    const created_request = await this.gateway.createJoinRequest({
      group_id: group_id,
      user_id: user_id,
    });
    return created_request as CreateJoinGroupRequestOutputModel;
  }
}
