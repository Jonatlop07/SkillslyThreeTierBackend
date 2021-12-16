import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { UnexistentGroupException } from '@core/domain/group/use-case/exception/group.exception';
import QueryGroupGateway from '@core/domain/group/use-case/gateway/query_group.gateway';
import { QueryGroupInteractor } from '@core/domain/group/use-case/interactor/query_group.interactor';
import QueryGroupInputModel from '@core/domain/group/use-case/input-model/query_group.input_model';
import QueryGroupOutputModel from '@core/domain/group/use-case/output-model/query_group.output_model';

export class QueryGroupService implements QueryGroupInteractor{
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: QueryGroupGateway
  ){}

  async execute(
    input: QueryGroupInputModel,
  ): Promise<QueryGroupOutputModel> {
    const { user_id, group_id } = input;
    const group = await this.gateway.findOne({ group_id: group_id });
    if (!group){
      throw new UnexistentGroupException();
    }
    const user_is_owner = await this.gateway.userIsOwner({ user_id: user_id, group_id: group_id });
    const user_is_member = await this.gateway.userIsMember({ user_id: user_id, group_id: group_id });
    const exists_request = await this.gateway.existsJoinRequest({ user_id: user_id, group_id: group_id });
    const { id, name, description, category, picture } = group;
    if (user_is_owner){
      return { id, name, description, category, picture, isOwner: true, isMember: true };
    }
    if (user_is_member){
      return { id, name, description, category, picture, isOwner: false, isMember: true };
    }

    return { id, name, description, category, picture, isOwner: false, isMember: false, existsRequest: exists_request };
  }
}
