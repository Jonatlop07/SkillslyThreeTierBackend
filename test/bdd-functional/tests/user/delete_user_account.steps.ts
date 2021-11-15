import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { DeleteUserAccountInteractor } from '@core/domain/user/use-case/interactor/delete_user_account.interactor';
import { QueryUserAccountInteractor } from '@core/domain/user/use-case/interactor/query_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  UserAccountException,
  UserAccountNotFoundException
} from '@core/domain/user/use-case/exception/user_account.exception';

const feature = loadFeature('test/bdd-functional/features/user/delete_user_account.feature');

defineFeature(feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string;

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
          id: user_id
        });
      }
    );
  }

  function thenTheUserAccountNoLongerExists(then) {
    then('the user account no longer exists', async () => {
      let exception: UserAccountException;
      try {
        await query_user_account_interactor.execute({
          id: user_id
        });
      } catch (e) {
        exception = e;
      }
      expect(exception).toBeInstanceOf(UserAccountNotFoundException);
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
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
