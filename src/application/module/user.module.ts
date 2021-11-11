import { Module, Provider } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserController } from '@application/api/http-rest/controller/user_controller';
import { UserNeo4jRepositoryAdapter } from '@infrastructure/adapter/persistence/neo4j/repository/user/neo4j_user_repository.adapter';
import { ValidateCredentialsService } from '@core/service/user/validate_credentials.service';
import { SearchUsersService } from '../../core/service/user/search_users.service';

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
    provide: UserDITokens.SearchUsersInteractor,
    useFactory: (gateway) => new SearchUsersService(gateway),
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
