import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';

const feature = loadFeature('test/bdd-functional/features/user/query_user_account.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };
  let user_id: string;
  let output: QueryUserOutputModel;

  async function createUser(input: QueryUserAccountInputModel) {
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
      async (id: string) => {
        output = await query_user_account_interactor({ user_id });
      }
    );
  }

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
