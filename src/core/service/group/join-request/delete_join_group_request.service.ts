import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { DeleteJoinGroupRequestInteractor } from '@core/domain/group/use-case/interactor/join-request/delete_join_group_request.interactor';
import DeleteJoinGroupRequestGateway from '@core/domain/group/use-case/gateway/join-request/delete_join_group_request.gateway';
import DeleteJoinGroupRequestInputModel from '@core/domain/group/use-case/input-model/join-request/delete_join_group_request.input_model';
import DeleteJoinGroupRequestOutputModel from '@core/domain/group/use-case/output-model/join-request/delete_join_group_request.output_model';
import { UnexistentJoinGroupRequestException } from '@core/domain/group/use-case/exception/group.exception';

export class DeleteJoinGroupRequestService
implements DeleteJoinGroupRequestInteractor {
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: DeleteJoinGroupRequestGateway,
  ) {}

  async execute(
    input: DeleteJoinGroupRequestInputModel,
  ): Promise<DeleteJoinGroupRequestOutputModel> {
    const { user_id, group_id } = input;
    const request_exists = await this.gateway.existsJoinRequest({
      group_id: group_id,
      user_id: user_id,
    });
    if (!request_exists) {
      throw new UnexistentJoinGroupRequestException();
    }
    const removed_request = await this.gateway.deleteJoinRequest({
      group_id: group_id,
      user_id: user_id,
    });
    return removed_request as DeleteJoinGroupRequestOutputModel;
  }
}
