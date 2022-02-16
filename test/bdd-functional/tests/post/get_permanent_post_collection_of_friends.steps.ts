import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import GetPermanentPostCollectionOfFriendsInputModel from '@core/domain/permanent-post/use-case/input-model/get_permanent_post_collection_of_friends.steps';
import { GetPermanentPostCollectionOfFriendsInteractor } from '@core/domain/permanent-post/use-case/interactor/get_permanent_post_collection_of_friends.interactor';
import GetPermanentPostCollectionOfFriendsOutputModel from '@core/domain/permanent-post/use-case/output-model/get_permanent_post_collection_of_friends.steps';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/post/get_permanent_post_collection_of_friends.feature');

defineFeature( feature, (test) => {
  const user_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let get_user_permanent_post_collection_of_friends_interactor: GetPermanentPostCollectionOfFriendsInteractor;
  let output: GetPermanentPostCollectionOfFriendsOutputModel;

  async function getPermanentPostCollectionOfFriends(input: GetPermanentPostCollectionOfFriendsInputModel) {
    try {
      output = await get_user_permanent_post_collection_of_friends_interactor.execute(input);
    } catch (e) {
      console.log(e);
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

  function whenTheUserTriesToGetPermanentPostsOfHisFriends(when) {
    when('the user tries to get permanent posts of his friends',
      async () => {
        await getPermanentPostCollectionOfFriends({
          user_id
        });
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    get_user_permanent_post_collection_of_friends_interactor = module.get<GetPermanentPostCollectionOfFriendsInteractor>(PostDITokens.GetPermanentPostCollectionOfFriendsInteractor);
  });

  test('A user gets a collection of permanent post of his friends',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenTheUserTriesToGetPermanentPostsOfHisFriends(when);
      then('a collection of permanent posts is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
