import { Inject } from '@nestjs/common';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import QueryGroupCollectionGateway from '@core/domain/group/use-case/gateway/query_group_collection.gateway';
import QueryGroupCollectionInputModel from '@core/domain/group/use-case/input-model/query_group_collection.input_model';
import { QueryGroupCollectionInteractor } from '@core/domain/group/use-case/interactor/query_group_collection.interactor';
import QueryGroupCollectionOutputModel from '@core/domain/group/use-case/output-model/query_group_collection.output_model';

export class QueryGroupCollectionService
implements QueryGroupCollectionInteractor {
  constructor(
    @Inject(GroupDITokens.GroupRepository)
    private readonly gateway: QueryGroupCollectionGateway,
  ) {}

  async execute(
    input: QueryGroupCollectionInputModel,
  ): Promise<QueryGroupCollectionOutputModel> {
    const { user_id, name, category, limit, offset } = input;
    if (name) {
      return { groups: await this.gateway.findWithName(name, {limit, offset}) };
    }
    if (user_id) {
      return { groups: await this.gateway.findUserGroups(user_id, {limit, offset})};
    }
    if (category) {
      return { groups: await this.gateway.findbyCategory(category, {limit, offset}) };
    }
    return { groups: [] };
  }
}
