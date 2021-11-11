import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';

function createServiceInputModel(): CreateUserAccountInputModel {
  return {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: v4(),
    date_of_birth: '01/01/2000',
  };
}

describe('Create user service', () => {
  let createUserAccountService: CreateUserAccountService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserAccountInteractor,
          useFactory: () =>
            new CreateUserAccountService(new UserInMemoryRepository(new Map())),
        },
      ],
    }).compile();

    createUserAccountService = module.get<CreateUserAccountService>(
      UserDITokens.CreateUserAccountInteractor,
    );
  });

  describe('execute', () => {
    it('should create user account', async () => {
      const createUserAccountInput: CreateUserAccountInputModel =
        createServiceInputModel();
      const createUserAccountOutput: CreateUserAccountOutputModel = {
        email: createUserAccountInput.email,
      };
      const resultCreateUserAccountOutput: CreateUserAccountOutputModel =
        await createUserAccountService.execute(createUserAccountInput);
      expect(resultCreateUserAccountOutput).toEqual(createUserAccountOutput);
    });
  });
});
