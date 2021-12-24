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
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/user/follow_request/update_user_follow_request.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = createUserMock();
  const user_mock_1: CreateUserAccountInputModel = createUserMock('newuser_1234@test.com');

  let user_id: string;
  let user_to_follow_id: string;
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
    and('a follow request exists between the users',
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

  function whenTheUserToFollowActionTheFollowRequest(when) {
    when(/^the user to follow "([^"]*)" the follow request$/,
      async (acceptString: string) => {
        const accept = acceptString === 'true';
        await updateUserFollowRequest({
          user_id,
          user_to_follow_id,
          accept
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
      andAnotherUserToFollowExists(and);
      andAFollowRequestExists(and);
      whenTheUserToFollowActionTheFollowRequest(when);
      then('the follow request is updated and the user follow the desired user', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A user rejects an existing follow request',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnotherUserToFollowExists(and);
      andAFollowRequestExists(and);
      whenTheUserToFollowActionTheFollowRequest(when);
      then('the follow request is updated and the user do not follow the desired user', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
