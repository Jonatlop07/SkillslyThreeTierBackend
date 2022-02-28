import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/create_permanent_post.interactor';
import { DeletePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/delete_permanent_post.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import {
  PermanentPostException,
  NonExistentPermanentPostException
} from '@core/domain/permanent-post/use-case/exception/permanent_post.exception';
import { QueryPermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/query_permanent_post.interactor';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import { CreateGroupInteractor } from '@core/domain/group/use-case/interactor/create_group.interactor';
import { GroupDITokens } from '@core/domain/group/di/group_di_tokens';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import { GroupException, UnauthorizedGroupEditorException } from '@core/domain/group/use-case/exception/group.exception';
import DeletePermanentPostOutputModel from '@core/domain/permanent-post/use-case/output-model/delete_permanent_post.output_model';

const feature = loadFeature('test/bdd-functional/features/post/delete_permanent_post.feature');

defineFeature(feature, (test) => {

  let user_id: string;
  let post_id: string;
  let group_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let query_permanent_post_interactor: QueryPermanentPostInteractor;
  let create_group_interactor: CreateGroupInteractor;
  let delete_permanent_post_interactor: DeletePermanentPostInteractor;

  let exception: GroupException;
  let output: DeletePermanentPostOutputModel;
  const user_1_mock: CreateUserAccountInputModel = createUserMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createPost(input: CreatePermanentPostInputModel) {
    try {
      return await create_permanent_post_interactor.execute(input);
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
            content: post_content_table,
            owner_id: post_owner_id,
            privacy: 'public'
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andGroupPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)", and that belongs to user "([^"]*)", and group "([^"]*)", with content being:$/,
      async (post_id, post_owner_id, post_group_id, post_content_table) => {
        try {
          await createPost({
            content: post_content_table,
            owner_id: post_owner_id,
            group_id: post_group_id,
            privacy: 'public'
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAGroupIdentifiedByIdExists(and) {
    and(
      /^there exists a group identified by "([^"]*)", owned by user with id "([^"]*)", with info being:$/,
      async (existing_group_id, group_owner_id, group_info) => {
        try {
          await create_group_interactor.execute({
            owner_id: group_owner_id,
            name: group_info[0].name,
            description: group_info[0].description,
            category: group_info[0].category,
            picture: group_info[0].picture,
          });
        } catch (e) {
          console.log(e);
        }
      },
    );
  }

  function andAPostIdIsProvided(and) {
    and(/^the user provides the post identified by "(.*)"$/,
      (provided_post_id) => {
        post_id = provided_post_id;
      }
    );
  }

  function andAPostGroupIdIsProvided(and) {
    and(/^the user provides the post identified by "([^"]*)" and the group identified by "([^"]*)"$/,
      (provided_post_id, provided_group_id) => {
        post_id = provided_post_id;
        group_id = provided_group_id;
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

  function whenTheGroupPermanentPostIsDeleted(when) {
    when('the user tries to delete the permanent post from the group', async () => {
      try {
        output = await delete_permanent_post_interactor.execute({
          post_id,
          group_id,
          user_id
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  function thenThePermanentPostNoLongerExists(then) {
    then('the permanent post no longer exists', async () => {
      let exception: PermanentPostException;
      try {
        await query_permanent_post_interactor.execute({
          id: post_id,
          owner_id: user_id
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
    create_group_interactor = module.get<CreateGroupInteractor>(GroupDITokens.CreateGroupInteractor);
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

  test('A logged in user tries to delete a group permanent post that belongs to them or the user is an admin',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andGroupPostIdentifiedByIdExists(and);
      andAPostGroupIdIsProvided(and);
      whenTheGroupPermanentPostIsDeleted(when);
      then(
        'the permanent post is deleted from the group',
        () => {
          expect(output).toBeDefined();
        },
      );
    }
  );

  test('A logged in user tries to delete a group permanent post that doesn\'t belongs to them and the user isn\'t an admin',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAGroupIdentifiedByIdExists(and);
      andGroupPostIdentifiedByIdExists(and);
      andAPostGroupIdIsProvided(and);
      whenTheGroupPermanentPostIsDeleted(when);
      then(
        'an error occurs: the user must own the post or be an admin to remove it',
        () => {
          expect(exception).toBeInstanceOf(UnauthorizedGroupEditorException);
        },
      );
    }
  );
});
