import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserFollowRequestException } from '@core/domain/user/use-case/exception/user_follow_request.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import GetUserFollowRequestCollectionInputModel from '@core/domain/user/use-case/input-model/follow_request/get_user_follow_request_collection.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { GetUserFollowRequestCollectionInteractor } from '@core/domain/user/use-case/interactor/follow_request/get_user_follow_request_collection.interactor';
import GetUserFollowRequestCollectionOutputModel from '@core/domain/user/use-case/output-model/follow_request/get_user_follow_request_collection.output_model';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../../create_test_module';

const feature = loadFeature('test/bdd-functional/features/user/follow_request/get_user_follow_request_collection.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string; 
  let create_user_account_interactor: CreateUserAccountInteractor;
  let get_user_follow_request_collection_interactor: GetUserFollowRequestCollectionInteractor;
  let output: GetUserFollowRequestCollectionOutputModel;
  let exception: UserFollowRequestException;

  async function getUserFollowRequestCollection(input: GetUserFollowRequestCollectionInputModel) {
    try {
      output = await get_user_follow_request_collection_interactor.execute(input);
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

  function whenTheUserTriesToGetHisRelationshipWithAnothersUsers(when) {
    when('the user tries to get his relationship with anothers users', 
      async () => {
        await getUserFollowRequestCollection({
          user_id
        });
      });
  }
  
  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    get_user_follow_request_collection_interactor = module.get<GetUserFollowRequestCollectionInteractor>(UserDITokens.GetUserFollowRequestCollectionInteractor);
  });

  test('A user gets a collection of existing follow requests or follow relationships',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenTheUserTriesToGetHisRelationshipWithAnothersUsers(when);
      then('a collection of follow request and follow relationships is returned', () => {
      });
    }
  );
});