import { Module, Provider } from '@nestjs/common';
import { UserController } from '@application/api/http-rest/controller/user.controller';
import { UserNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/user/neo4j_user_repository.adapter';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { ValidateCredentialsService } from '@core/service/user/validate_credentials.service';
import { UpdateUserAccountService } from '@core/service/user/update_user_account.service';
import { QueryUserAccountService } from '@core/service/user/query_user_account.service';
import { DeleteUserAccountService } from '@core/service/user/delete_user_account.service';

const persistence_providers: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useClass: UserNeo4jRepositoryAdapter
  }
];

const use_case_providers: Provider[] = [
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
