import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import {
  PermanentPostException,
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException
} from '@core/domain/post/use-case/exception/permanent_post.exception';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/update_permanent_post.interactor';
import { UpdatePermanentPostOutputModel } from '@core/domain/post/use-case/output-model/update_permanent_post.output_model';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_content_post_element';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/post/update_permanent_post.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = createUserMock();

  let user_id: string;
  let owner_id: string;
  let post_to_update_id: string;
  let post_new_content: Array<PermanentPostContentElement>;
  let post_new_privacy = 'public';

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let update_permanent_post_interactor: UpdatePermanentPostInteractor;

  let output: UpdatePermanentPostOutputModel;
  let exception: PermanentPostException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = owner_id = id;
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
    and(/^there exists a post identified by "([^"]*)", with privacy "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
      async (post_id, post_privacy, post_owner_id, post_content_table) => {
        try {
          await create_permanent_post_interactor.execute({
            id: post_id,
            content: post_content_table,
            user_id: owner_id,
            privacy: post_privacy
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
        post_to_update_id = provided_post_id;
      }
    );
  }

  function andTheUserProvidesNewContentOfThePost(and) {
    and('the user provides the new content of the post being:',
      (post_new_content_table) => {
        post_new_content = post_new_content_table;
      }
    );
  }

  function andTheUserProvidesNewPrivacyOfThePost(and) {
    and(/^the user provides the new privacy of the post being "([^"]*)"$/,
      (post_new_privacy_setting) => {
        post_new_privacy = post_new_privacy_setting;
      }
    );
  }

  function whenTheUserTriesToUpdateThePost(when) {
    when('the user tries to update the post', async () => {
      try {
        output = await update_permanent_post_interactor.execute({
          id: post_to_update_id,
          content: post_new_content,
          privacy: post_new_privacy,
          user_id,
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  function thenThePostIsUpdatedWithTheContentProvided(then) {
    then('the post is updated with the new content provided', () => {
      expect(output).toBeDefined();
    });
  }

  function thenThePostIsUpdatedWithTheNewPrivacy(then) {
    then('the post is updated with the new privacy setting', () => {
      expect(output).toBeDefined();
      expect(output.privacy).toEqual('private');
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_permanent_post_interactor = module.get<CreatePermanentPostInteractor>(PostDITokens.CreatePermanentPostInteractor);
    update_permanent_post_interactor = module.get<UpdatePermanentPostInteractor>(PostDITokens.UpdatePermanentPostInteractor);
    exception = undefined;
  });

  test('A logged in user tries to update a permanent post with multimedia content and descriptions',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheContentProvided(then);
    }
  );

  test('A logged in user tries to create a permanent post without any content',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      then('an error occurs: the post to create needs to have some kind of content', () => {
        expect(exception).toBeInstanceOf(EmptyPermanentPostContentException);
      });
    }
  );

  test('A logged in user tries to update a permanent post with only text',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheContentProvided(then);
    }
  );

  test('A logged in user tries to update a permanent post with only multimedia content',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheContentProvided(then);
    }
  );

  test('A logged in user tries to update a permanent post that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      then('an error occurs: the post with the provided id does not exist', () => {
        expect(exception).toBeInstanceOf(NonExistentPermanentPostException);
      });
    }
  );

  test('A logged in user tries to update a permanent posts privacy from public to private',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      andTheUserProvidesNewPrivacyOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheNewPrivacy(then);
    }
  );

});
