import { Module, Provider } from '@nestjs/common';
import { UserController } from '@application/api/http-rest/controller/user.controller';
import { UserNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/user/neo4j_user_repository.adapter';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { ValidateCredentialsService } from '@core/service/user/validate_credentials.service';
import { UpdateUserAccountService } from '@core/service/user/update_user_account.service';
import { QueryUserAccountService } from '@core/service/user/query_user_account.service';
import { DeleteUserAccountService } from '@core/service/user/delete_user_account.service';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { SearchUsersService } from '@core/service/user/search_users.service';
import { CreateUserFollowRequestService } from '@core/service/user/follow_request/create_user_follow_request.service';
import { UpdateUserFollowRequestService } from '@core/service/user/follow_request/update_user_follow_request.service';
import { DeleteUserFollowRequestService } from '@core/service/user/follow_request/delete_user_follow_request.service';
import { GetUserFollowRequestCollectionService } from '@core/service/user/follow_request/get_user_follow_request_collection.service';

const persistence_providers: Array<Provider> = [
  {
    provide: UserDITokens.UserRepository,
    useClass: UserNeo4jRepositoryAdapter
  }
];

const use_case_providers: Array<Provider> = [
  {
    provide: UserDITokens.CreateUserAccountInteractor,
    useFactory: (gateway) => new CreateUserAccountService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.ValidateCredentialsInteractor,
    useFactory: (gateway) => new ValidateCredentialsService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.QueryUserAccountInteractor,
    useFactory: (gateway) => new QueryUserAccountService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.DeleteUserAccountInteractor,
    useFactory: (gateway) => new DeleteUserAccountService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.UpdateUserAccountInteractor,
    useFactory: (gateway) => new UpdateUserAccountService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.SearchUsersInteractor,
    useFactory: (gateway) => new SearchUsersService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.CreateUserFollowRequestInteractor,
    useFactory: (gateway) => new CreateUserFollowRequestService(gateway),
    inject: [UserDITokens.UserRepository]
  }, 
  {
    provide: UserDITokens.UpdateUserFollowRequestInteractor,
    useFactory: (gateway) => new UpdateUserFollowRequestService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.DeleteUserFollowRequestInteractor,
    useFactory: (gateway) => new DeleteUserFollowRequestService(gateway),
    inject: [UserDITokens.UserRepository]
  },
  {
    provide: UserDITokens.GetUserFollowRequestCollectionInteractor,
    useFactory: (gateway) => new GetUserFollowRequestCollectionService(gateway),
    inject: [UserDITokens.UserRepository]
  }
];

@Module({
  controllers: [
    UserController
  ],
  providers: [
    ...persistence_providers,
    ...use_case_providers
  ],
  exports: [
    UserDITokens.UserRepository,
    UserDITokens.ValidateCredentialsInteractor
  ]
})
export class UserModule {}
