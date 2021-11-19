import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post.interactor';
import { SharePermanentPostInteractor } from '@core/domain/post/use-case/interactor/share_permanent_post.interactor';
import SharePermanentPostOutputModel from '@core/domain/post/use-case/output-model/share_permanent_post.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';

const feature = loadFeature('test/bdd-functional/features/post/share_permanent_post.feature');

defineFeature(feature, (test) => {

  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string;
  let owner_id: string;
  let post_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor; 
  let share_permanent_post_interactor: SharePermanentPostInteractor; 

  let output: SharePermanentPostOutputModel; 

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given('a user exists', async () => {
      await createUserAccount(user_1_mock);
    });
  }

  function andAPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)"$/,
      async (post_id, post_content_table) => {
        try {
          await create_permanent_post_interactor.execute({
            id: post_id,
            content: post_content_table,
            user_id: owner_id
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAPostIdIsProvided(and) {
    and(/^the user provides the post identified by "([^"]*)"$/,
      (provided_post_id) => {
        post_id = provided_post_id;
      }
    );
  }

  function whenTheUserTriesToShareThePost(when) {
    when('the user tries to share the post', async () => {
      try {
        output = await share_permanent_post_interactor.execute({
          post_id,
          user_id
        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  function thenThePostIsSharedOnTheProfileOfTheUser(then) {
    then('the post is shared on the profile of the user who performs the action', () => {
      expect(output).toBeDefined();
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_permanent_post_interactor = module.get<CreatePermanentPostInteractor>(PostDITokens.CreatePermanentPostInteractor);
    share_permanent_post_interactor = module.get<SharePermanentPostInteractor>(PostDITokens.SharePermanentPostInteractor);
  });

  test('A logged in user shares an existing permanent post',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      whenTheUserTriesToShareThePost(when);
      thenThePostIsSharedOnTheProfileOfTheUser(then);
    }
  );
})