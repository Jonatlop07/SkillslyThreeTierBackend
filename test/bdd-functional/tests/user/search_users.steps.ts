import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';
import SearchUsersOutputModel from '@core/domain/user/use-case/output-model/search_users.output_model';
import { SearchUsersService } from '@core/service/user/search_users.service';
import SearchUsersInputModel from '@core/domain/user/input-model/search_users.input_model';
import { SearchUsersInteractor } from '@core/domain/user/use-case/search_users.interactor';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import { SearchedUserDTO } from '../../../../src/core/domain/user/use-case/persistence-dto/searched_user.dto';

const feature = loadFeature('test/bdd-functional/features/user/search_users.feature'); 

defineFeature(feature, (test) =>{
  let email: string; 
  let name: string; 
  let create_user_account_interactor: CreateUserAccountInteractor;
  let search_users_interactor: SearchUsersInteractor; 
  let output: SearchUsersOutputModel;
  let expected_searched_users: SearchedUserDTO[]; 
  let repository : UserInMemoryRepository;

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

  beforeAll(() => {
    repository = new UserInMemoryRepository(new Map());
    create_user_account_interactor = new CreateUserAccountService(repository); 
    search_users_interactor = new SearchUsersService(repository);
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
        console.log(output)
        expect(output).toBeDefined();
        expect(output).toEqual({users:expected_searched_users});
      });
    });
});