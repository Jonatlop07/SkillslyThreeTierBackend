import { Module, Provider } from '@nestjs/common';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserController } from '@application/api/http-rest/controller/user/user_controller';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';

const persistence_providers: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useFactory: () => new UserInMemoryRepository(new Map())
  }
];

const use_case_providers: Provider[] = [
  {
    provide: UserDITokens.CreateUserAccountInteractor,
    useFactory: (gateway) => new CreateUserAccountService(gateway),
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
    UserDITokens.UserRepository
  ]
})
export class UserModule {}
