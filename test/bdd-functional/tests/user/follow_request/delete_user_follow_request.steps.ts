import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserFollowRequestException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import DeleteUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/delete_user_follow_request.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import { DeleteUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/delete_user_follow_request.interactor';
import DeleteUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/delete_user_follow_request.output_model';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';

const feature = loadFeature('test/bdd-functional/features/user/follow_request/delete_user_follow_request.feature');

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
  let user_to_follow_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_user_follow_request_interactor: CreateUserFollowRequestInteractor;
  let delete_user_follow_request_interactor: DeleteUserFollowRequestInteractor;
  let output: DeleteUserFollowRequestOutputModel;
  let exception: UserFollowRequestException;

  async function deleteUserFollowRequest(input: DeleteUserFollowRequestInputModel) {
    try {
      output = await delete_user_follow_request_interactor.execute(input);
    } catch (e) {
      exception = e;
      console.log(exception);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id (.*)$/,
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

  function andAnotherUserToFollowExists(and) {
    and(/^another user to follow exists, and has an id "([^"]*)"$/,
      async (id: string) => {
        user_to_follow_id = id;
        try {
          const resp = await create_user_account_interactor.execute(user_mock_1);
          user_to_follow_id = resp.id;
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAFollowRequestExists(and){
    and('a follow request or a follow relationship exists between the users',
      async () => {
        try {
          await create_user_follow_request_interactor.execute({
            user_id,
            user_to_follow_id
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function whenTheUserDeleteTheFollowRequest(when) {
    when(/^the user tries to delete the "([^"]*)"$/,
      async (isRequestString: string) => {
        const is_request = isRequestString === 'true';
        await deleteUserFollowRequest({
          user_id,
          user_to_follow_id,
          is_request
        });
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_user_follow_request_interactor = module.get<CreateUserFollowRequestInteractor>(UserDITokens.CreateUserFollowRequestInteractor);
    delete_user_follow_request_interactor = module.get<DeleteUserFollowRequestInteractor>(UserDITokens.DeleteUserFollowRequestInteractor);
  });

  test('A user deletes an existing follow request or a follow relationship',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnotherUserToFollowExists(and);
      andAFollowRequestExists(and);
      whenTheUserDeleteTheFollowRequest(when);
      then('the follow request is deleted or the user stop following the desired user', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
