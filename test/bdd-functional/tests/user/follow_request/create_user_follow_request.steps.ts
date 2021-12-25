import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserFollowRequestAlreadyExistsException, UserFollowRequestException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import CreateUserFollowRequestOutputModel from '@core/domain/user/use-case/output-model/follow_request/create_user_follow_request.output_model';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/user/follow_request/create_user_follow_request.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = createUserMock();
  const user_mock_1: CreateUserAccountInputModel = createUserMock('newuser_1234@test.com');

  let user_id: string;
  let user_to_follow_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_user_follow_request_interactor: CreateUserFollowRequestInteractor;
  let output: CreateUserFollowRequestOutputModel;
  let exception: UserFollowRequestException = undefined;

  async function createUserFollowRequest(input: CreateUserFollowRequestInputModel) {
    try {
      output = await create_user_follow_request_interactor.execute(input);
    } catch (e) {
      exception = e;
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

  function andAnotherUserDestinyExists(and) {
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

  function whenTheUserRequestToFollowTheDesiredUser(when) {
    when('the user request to follow the desired user', async () => {
      await createUserFollowRequest({
        user_id,
        user_to_follow_id
      });
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_user_follow_request_interactor = module.get<CreateUserFollowRequestInteractor>(UserDITokens.CreateUserFollowRequestInteractor);
    exception = undefined;
  });

  test('A logged in user request friendship to another existing user',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnotherUserDestinyExists(and);
      whenTheUserRequestToFollowTheDesiredUser(when);
      then('a user follow request is created', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A logged in user fails to request friendship to another existing user because there already exists a friedship request',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAnotherUserDestinyExists(and);
      and(
        'there already exists an friendship request between the users',
        async () => {
          await createUserFollowRequest({
            user_id,
            user_to_follow_id
          });
        },
      );
      whenTheUserRequestToFollowTheDesiredUser(when);
      then(
        'an error occurs: a friendship request between the users already exists',
        () => {
          expect(exception).toBeInstanceOf(UserFollowRequestAlreadyExistsException);
        }
      );
    }
  );
});
