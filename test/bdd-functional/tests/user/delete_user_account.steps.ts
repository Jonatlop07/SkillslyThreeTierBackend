import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { QueryUserAccountService } from '@core/service/user/query_user_account.service';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { QueryUserAccountInteractor } from '@core/domain/user/use-case/query_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';

const feature = loadFeature('test/bdd-functional/features/user/delete_user_account.feature');


defineFeature(feature, (test) => {
  let user_id: string;

  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let create_user_account_interactor: CreateUserAccountInteractor;
  let delete_user_account_interactor: DeleteUserAccountInteractor;
  let query_user_account_interactor: QueryUserAccountInteractor;

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id of "([^"]*)"$/,
      async (id: string) => {
        user_id = id;
        try {
          await create_user_account_interactor.execute(user_mock);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenUserTriesToDeleteAccount(when) {
    when('the user tries to delete their account',
      async () => {
        await delete_user_account_interactor.execute({
          user_id
        });
      }
    );
  }

  function thenTheUserAccountNoLongerExists(then) {
    then('the user account no longer exists', async () => {
      expect(await query_user_account_interactor.execute({
        id: user_id
      })).toThrowError();
    });
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
          provide: UserDITokens.DeleteUserAccountInteractor,
          useFactory: (gateway) => new DeleteUserAccountService(gateway),
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
    delete_user_account_interactor = module.get<DeleteUserAccountInteractor>(UserDITokens.DeleteUserAccountInteractor);
    query_user_account_interactor = module.get<QueryUserAccountInteractor>(UserDITokens.QueryUserAccountInteractor);
  });

  test('A logged in user tries to delete their account',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenUserTriesToDeleteAccount(when);
      thenTheUserAccountNoLongerExists(then);
    }
  );
});
