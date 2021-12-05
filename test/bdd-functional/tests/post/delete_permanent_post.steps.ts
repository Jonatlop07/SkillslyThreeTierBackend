import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { DeletePermanentPostInteractor } from '@core/domain/post/use-case/interactor/delete_permanent_post.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import {
  PermanentPostException,
  NonExistentPermanentPostException
} from '@core/domain/post/use-case/exception/permanent_post.exception';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post.interactor';

const feature = loadFeature('test/bdd-functional/features/post/delete_permanent_post.feature');

defineFeature(feature, (test) => {

  let user_id: string;
  let post_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let query_permanent_post_interactor: QueryPermanentPostInteractor;
  let delete_permanent_post_interactor: DeletePermanentPostInteractor;

  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

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
    and(/^there exists a post identified by "(.*)", and that belongs to user "(.*)"$/,
      async (post_id, post_owner_id, post_content_table) => {
        try {
          await create_permanent_post_interactor.execute({
            id: post_id,
            content: post_content_table,
            user_id: post_owner_id
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }
  function andAPostIdIsProvided(and) {
    and(/^the user provides the post identified by "(.*)"$/,
      (provided_post_id) => {
        post_id = provided_post_id;
      }
    );
  }

  function whenTheUserTriesToDeleteThePost(when) {
    when('the user tries to delete their permanent post',
      async () => {
        await delete_permanent_post_interactor.execute({
          post_id,
        });
      }
    );
  }

  function thenThePermanentPostNoLongerExists(then) {
    then('the permanent post no longer exists', async () => {
      let exception: PermanentPostException;
      try {
        await query_permanent_post_interactor.execute({
          id: post_id,
          user_id
        });
      } catch (e) {
        exception = e;
      }
      expect(exception).toBeInstanceOf(NonExistentPermanentPostException);
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_permanent_post_interactor = module.get<CreatePermanentPostInteractor>(PostDITokens.CreatePermanentPostInteractor);
    query_permanent_post_interactor = module.get<QueryPermanentPostInteractor>(PostDITokens.QueryPermanentPostInteractor);
    delete_permanent_post_interactor = module.get<DeletePermanentPostInteractor>(PostDITokens.DeletePermanentPostInteractor);
  });

  test('A logged in user tries to delete their permanent post',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      whenTheUserTriesToDeleteThePost(when);
      thenThePermanentPostNoLongerExists(then);
    }
  );
});