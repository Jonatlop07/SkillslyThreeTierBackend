import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import GetJoinRequestsGateway from '@core/domain/group/use-case/gateway/join-request/get_join_requests.gateway';
import GetJoinRequestsInputModel from '@core/domain/group/use-case/input-model/join-request/get_join_requests.input_model';
import { GetJoinRequestsInteractor } from '@core/domain/group/use-case/interactor/join-request/get_join_requests.interactor';
import GetJoinRequestsOutputModel from '@core/domain/group/use-case/output-model/join-request/get_join_requests.output_model';

export class GetJoinRequestsService
implements GetJoinRequestsInteractor {
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: GetJoinRequestsGateway,
  ) {}
  async execute(
    input: GetJoinRequestsInputModel,
  ): Promise<GetJoinRequestsOutputModel> {
    const join_requests = await this.gateway.getJoinRequests(input.group_id, { limit: input.limit, offset: input.offset });
    if (!join_requests){
      return { joinRequests: [] };
    }
    return {
      joinRequests: join_requests
    };
  }
}
