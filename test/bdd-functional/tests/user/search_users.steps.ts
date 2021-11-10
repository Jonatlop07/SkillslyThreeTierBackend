import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';

const feature = loadFeature('test/bdd-functional/features/user/search_users.feature'); 

defineFeature(feature, (test) =>{
    let email : string; 
    let name: string; 
    let create_user_account_interactor: CreateUserAccountInteractor;
    let search_users_service: SearchUsersService; 
    let output : SearchUsersOutputModel; 

    async function searchUsers(input: SearchUsersInputModel) {
        output = await search_users_service.execute(input);
    }

    function givenUserProvidesParameters(given) {
        given(/^the user provides the parameters: "([^"]*)" and "([^"]*)"$/,
          (input_email: string, input_name: string) => {
            email = input_email;
            name = input_name;
          });
    }

    function andAccountsExistsWithParameters(and){
        and('accounts exists with parameters:', (users) => {
            users.array.forEach( async user => {
                try{
                    await create_user_account_interactor.execute(user);
                } catch(e) {
                    console.log(e); 
                }
            });
        });
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            {
              provide: UserDITokens.CreateUserAccountInteractor,
              useFactory: (gateway) => new CreateUserAccountService(gateway),
              inject: [UserDITokens.UserRepository],
            },
            {
              provide: UserDITokens.UserRepository,
              useFactory: () => new UserInMemoryRepository(new Map()),
            },
            {
              provide: UserDITokens.SearchUsersInteractor,
              useFactory: (gateway) => new SearchUsersService(gateway),
              inject: [UserDITokens.UserRepository],
            }
          ],
        }).compile();
    
        create_user_account_interactor = module.get<CreateUserAccountInteractor>(
          UserDITokens.CreateUserAccountInteractor,
        );
        search_users_interactor = module.get<SearchUsersInteractor>(
            UserDITokens.SearchUsersInteractor,
        );
    });

    function whenUserTriesToSearchForAnUser(when) {
        when('the user tries to search for an user', async () => {
          await searchUsers({
            email,
            name
          });
        });
    }

    test(' A user searches for another user based on one or more data of the account or the profile information.',
    ({ given, and, when, then }) => {
      givenUserProvidesParameters(given);
      andAccountsExistsWithParameters(and);
      whenUserTriesToSearchForAnUser(when);

      then('the users associated with the parameters entered are returned.', () => {
        const expected_output: SearchUsersOutputModel = { users };
        expect(output).toBeDefined();
        expect(output).toEqual(expected_output);
      });
    });
})