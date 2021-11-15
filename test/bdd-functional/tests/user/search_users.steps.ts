import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { SearchUsersInteractor } from '@core/domain/user/use-case/interactor/search_users.interactor';
import SearchUsersOutputModel from '@core/domain/user/use-case/output-model/search_users.output_model';
import { SearchedUserDTO } from '@core/domain/user/use-case/persistence-dto/searched_user.dto';
import SearchUsersInputModel from '@core/domain/user/use-case/input-model/search_users.input_model';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';

const feature = loadFeature('test/bdd-functional/features/user/search_users.feature');

defineFeature(feature, (test) =>{
  let email: string;
  let name: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let search_users_interactor: SearchUsersInteractor;

  let output: SearchUsersOutputModel;
  let expected_searched_users: Array<SearchedUserDTO>;

  async function searchUsers(input: SearchUsersInputModel) {
    output = await search_users_interactor.execute(input);
  }

  function givenUserProvidesParameters(given) {
    given(/^a user provides the parameters: "([^"]*)" or "([^"]*)"$/,
      (input_email: string, input_name: string) => {
        email = input_email;
        name = input_name;
      });
  }

  function andAccountsExistsWithParameters(and){
    and('accounts exists with parameters:', (users) => {
      expected_searched_users = users
        .filter((user: UserDTO) =>
          user.email === email || user.name === name
        )
        .map((user: UserDTO) =>
          ({
            email: user.email,
            name: user.name
          })
        );
      users.forEach( async user => {
        try {
          await create_user_account_interactor.execute(user);
        } catch (e) {
          console.log(e);
        }
      });
    });
  }

  beforeAll(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    search_users_interactor = module.get<SearchUsersInteractor>(UserDITokens.SearchUsersInteractor);
  });

  function whenUserTriesToSearchForAnUser(when) {
    when('the user tries to search for an user', async () => {
      await searchUsers({
        email,
        name
      });
    });
  }

  test('A user searches for another user based on one or more data of the account or the profile information',
    ({ given, and, when, then }) => {
      givenUserProvidesParameters(given);
      andAccountsExistsWithParameters(and);
      whenUserTriesToSearchForAnUser(when);
      then('the users associated with the parameters entered are returned', () => {
        expect(output).toBeDefined();
        expect(output).toEqual({users:expected_searched_users});
      });
    });
});
