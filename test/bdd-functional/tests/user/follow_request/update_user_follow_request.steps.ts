import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserFollowRequestException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import { UpdateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/update_user_follow_request.interactor';
import UpdateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/update_user_follow_request.output_model';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';

const feature = loadFeature('test/bdd-functional/features/user/follow_request/update_user_follow_request.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };
  const user_mock_1: CreateUserAccountInputModel = {
    email: 'newuser_1234@test.com',
    password: 'Abc123_tr',
    name: 'JuanDestiny',
    date_of_birth: '01/01/2000'
  };

  let user_id: string; 
  let user_destiny_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_user_follow_request_interactor: CreateUserFollowRequestInteractor;
  let update_user_follow_request_interactor: UpdateUserFollowRequestInteractor;
  let output: UpdateUserFollowRequestOutputModel;
  let exception: UserFollowRequestException;

  async function updateUserFollowRequest(input: UpdateUserFollowRequestInputModel) {
    try {
      output = await update_user_follow_request_interactor.execute(input);
    } catch (e) {
      exception = e;
      console.log(exception);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id "([^"]*)"$/,
      async (id: string) => {
        user_id = id;
        try {
          const resp = await create_user_account_interactor.execute(user_mock);
          user_id = resp.id; 
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAnotherUserDestinyExists(and) {
    and(/^another user destiny exists, and has an id "([^"]*)"$/,
      async (id: string) => {
        user_destiny_id = id;
        try {
          const resp = await create_user_account_interactor.execute(user_mock_1);
          user_destiny_id = resp.id; 
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAFollowRequestExists(and){
    and('a follow request exists between the users',
      async () => {
        try {
          await create_user_follow_request_interactor.execute({
            user_id,
            user_destiny_id
          });
        } catch (e) {
          console.log(e); 
        }
      }
    );
  }

  function whenTheUserDestinyActionTheFollowRequest(when) {
    when(/^the user destiny "([^"]*)" the follow request$/, 
      async (action: string) => {
        await updateUserFollowRequest({
          user_id,
          user_destiny_id, 
          action
        });
      });
  }
  
  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_user_follow_request_interactor = module.get<CreateUserFollowRequestInteractor>(UserDITokens.CreateUserFollowRequestInteractor);
    update_user_follow_request_interactor = module.get<UpdateUserFollowRequestInteractor>(UserDITokens.UpdateUserFollowRequestInteractor);
  });

  test('A user accepts an existing follow request',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnotherUserDestinyExists(and);
      andAFollowRequestExists(and);
      whenTheUserDestinyActionTheFollowRequest(when);
      then('the follow request is updated and the user follow the destiny user', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A user rejects an existing follow request',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnotherUserDestinyExists(and);
      andAFollowRequestExists(and);
      whenTheUserDestinyActionTheFollowRequest(when);
      then('the follow request is updated and the user do not follow the destiny user', () => {
        expect(output).toBeDefined();
      });
    }
  );
  
}); 