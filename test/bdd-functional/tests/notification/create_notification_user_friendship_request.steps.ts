import { defineFeature, loadFeature } from "jest-cucumber";
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from "@core/domain/user/use-case/interactor/create_user_account.interactor";
import { QueryUserAccountInteractor } from "@core/domain/user/use-case/interactor/query_user_account.interactor";
import QueryUserAccountOutputModel from "@core/domain/user/use-case/output-model/query_user_interactor.output_model";
import { UserDTO } from "@core/domain/user/use-case/persistence-dto/user.dto";
import { createTestModule } from "../create_test_module";
import { UserDITokens } from "@core/domain/user/di/user_di_tokens";

const feature = loadFeature('test/bdd-functional/features/notification/create_notification_user_friendship_request'); 

defineFeature(feature, (test) => {
  let user_mock_origin: QueryUserAccountOutputModel; 

  const user_mock_destiny: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  }; 

  let user_id: string;
  let output: CreateNotificationUserFriendshipRequestOutputModel;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_notification_user_friendship_request_interactor: CreateNotificationUserFriendshipRequestInteractor;
  let query_user_account_interactor: QueryUserAccountInteractor;

  function  givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id of "([^"]*)"$/,
      async (id: string) => {
        user_id = id;
        user_mock_origin = await query_user_account_interactor.execute({ id: user_id });
      }
    );
  }
  
  function andAccountExists(and){
    and('an account exists with credentials:'), async (user: UserDTO) => {
      try {
        await create_user_account_interactor.execute(user);
      } catch (e) {
        console.log(e);
      }
    };
  }
  
  function whenUserRequestsFriendshipToUserAccount(when) {
    when('the user requests a friendship to the user account',
      async () => {
        output = await create_notification_user_friendship_request_interactor.execute({
          //InputModel
         });
      }
    );
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    query_user_account_interactor = module.get<QueryUserAccountInteractor>(UserDITokens.QueryUserAccountInteractor);
  });

  test('A user sends a friend request on another existing users account and the other user receives a notification',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAccountExists(and);
      whenUserRequestsFriendshipToUserAccount(when);
      then('a notification is created and the user related to the account receives it',
        () => {
          expect(output).toBeDefined();
        }
      );
    }
  );
})
