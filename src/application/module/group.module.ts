import { Module, Provider } from '@nestjs/common';
import { UserModule } from '@application/module/user.module';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import { GroupNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/group/neo4j_group_repository.adapter';
import { CreateGroupService } from '@core/service/group/create_group.service';
import { UpdateGroupService } from '@core/service/group/update_group.service';
import { DeleteGroupService } from '@core/service/group/delete_group.service';
import { CreateJoinGroupRequestService } from '@core/service/group/join-request/create_join_group_request.service';
import { DeleteJoinGroupRequestService } from '@core/service/group/join-request/delete_join_group_request.service';
import { UpdateGroupUserService } from '@core/service/group/join-request/update_group_user.service';
import { LeaveGroupService } from '@core/service/group/leave_group.service';
import { QueryGroupCollectionService } from '@core/service/group/query_group_collection.service';
import { QueryGroupService } from '@core/service/group/query_group.service';
import { GetJoinRequestsService } from '@core/service/group/join-request/get_join_requests.service';
import { QueryGroupUsersService } from '@core/service/group/query_group_users.service';
import { GroupController } from '@application/api/http-rest/controller/group.controller';

const persistence_providers: Array<Provider> = [
  {
    provide: GroupDITokens.GroupRepository,
    useClass: GroupNeo4jRepositoryAdapter,
  },
];

const use_case_providers: Array<Provider> = [
  {
    provide: GroupDITokens.CreateGroupInteractor,
    useFactory: (gateway) => new CreateGroupService(gateway),
    inject: [GroupDITokens.GroupRepository],
  },
  {
    provide: GroupDITokens.UpdateGroupInteractor,
    useFactory: (gateway) => new UpdateGroupService(gateway),
    inject: [GroupDITokens.GroupRepository],
  },
  {
    provide: GroupDITokens.DeleteGroupInteractor,
    useFactory: (gateway) => new DeleteGroupService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.CreateJoinGroupRequestInteractor,
    useFactory: (gateway) => new CreateJoinGroupRequestService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.DeleteJoinGroupRequestInteractor,
    useFactory: (gateway) => new DeleteJoinGroupRequestService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.UpdateGroupUserInteractor,
    useFactory: (gateway) => new UpdateGroupUserService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.LeaveGroupInteractor,
    useFactory: (gateway) =>  new LeaveGroupService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.QueryGroupInteractor,
    useFactory: (gateway) => new QueryGroupService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.QueryGroupCollectionInteractor,
    useFactory: (gateway) => new QueryGroupCollectionService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.GetJoinRequestsInteractor,
    useFactory: (gateway) => new GetJoinRequestsService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
  {
    provide: GroupDITokens.QueryGroupUsersInteractor,
    useFactory: (gateway) => new QueryGroupUsersService(gateway),
    inject: [GroupDITokens.GroupRepository]
  },
];

@Module({
  imports: [ UserModule ],
  controllers: [ GroupController ],
  providers: [...persistence_providers, ...use_case_providers],
  exports: [GroupDITokens.GroupRepository],
})
export class GroupModule {}
