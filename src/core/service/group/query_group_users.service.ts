import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import QueryGroupUsersGateway from '@core/domain/group/use-case/gateway/query_group_users.gateway';
import QueryGroupUsersInputModel from '@core/domain/group/use-case/input-model/query_group_users.input_model';
import { QueryGroupUsersInteractor } from '@core/domain/group/use-case/interactor/query_group_users.interactor';
import QueryGroupUsersOutputModel from '@core/domain/group/use-case/output-model/query_group_users.output_model';
import { UnexistentGroupException } from '@core/domain/group/use-case/exception/group.exception';

export class QueryGroupUsersService
implements QueryGroupUsersInteractor {
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: QueryGroupUsersGateway,
  ) {}
  async execute(
    input: QueryGroupUsersInputModel,
  ): Promise<QueryGroupUsersOutputModel> {
    const group = await this.gateway.findOne({ group_id: input.group_id });
    if (!group){
      throw new UnexistentGroupException();
    }
    const group_users = await this.gateway.queryUsers(input.group_id, { limit: input.limit, offset: input.offset });
    if (!group_users){
      return {
        groupUsers: []
      };
    }
    return {
      groupUsers: group_users
    };
  }
}
