import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { QueryUserAccountService } from '@core/service/user/query_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { QueryUserAccountInteractor } from '@core/domain/user/use-case/query_user_account.interactor';
import QueryUserAccountOutputModel from '@core/domain/user/use-case/output-model/query_user_interactor.output_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';

const feature = loadFeature('test/bdd-functional/features/user/query_user_account.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };
  let user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let query_user_account_interactor: QueryUserAccountInteractor;
  let output: QueryUserAccountOutputModel;

  async function createUser(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id of "([^"]*)"$/,
      async (id: string) => {
        user_id = id;
        await createUser(user_1_mock);
      }
    );
  }

  function whenUserTriesToQueryAccountById(when) {
    when('the user tries to query the account',
      async () => {
        output = await query_user_account_interactor.execute({ id: user_id });
      }
    );
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserAccountInteractor,
          useFactory: (gateway) => new CreateUserAccountService(gateway),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.QueryUserAccountInteractor,
          useFactory: (gateway) => new QueryUserAccountService(gateway),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UserRepository,
          useFactory: () => new UserInMemoryRepository(new Map())
        }
      ]
    }).compile();

    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    query_user_account_interactor = module.get<QueryUserAccountInteractor>(UserDITokens.QueryUserAccountInteractor);
  });

  test('A logged in user tries to query their account information',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenUserTriesToQueryAccountById(when);
      then('the information of their account is successfully retrieved',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );
});
