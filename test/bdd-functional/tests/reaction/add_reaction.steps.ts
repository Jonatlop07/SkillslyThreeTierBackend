import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { AddReactionInvalidTypeException, AddReactionUnexistingPostException, ReactionException } from '@core/domain/reaction/use_case/exception/reaction.exception';
import { AddReactionInteractor } from '@core/domain/reaction/use_case/interactor/add_reaction.interactor';
import AddReactionOutputModel from '@core/domain/reaction/use_case/output-model/add_reaction.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/reaction/add_reaction.feature');

defineFeature(feature, (test) => {
  let reactor_id: string;
  let post_to_react_to: string;
  let reaction_type: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let add_reaction_interactor: AddReactionInteractor;
  let added_or_removed_reaction: AddReactionOutputModel;
  let existing_reaction: AddReactionOutputModel;
  let exception: ReactionException = undefined;

  const user_1 = createUserMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      return id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given('a user exists', async () => {
      reactor_id = await createUserAccount(user_1);
    });
  }

  function andAPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
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

  function andPostIdAndReactionTypeAreProvided(and) {
    and(/^the user provides the id of the post being "([^"]*)" and the type of the reaction to add being "([^"]*)"$/,
      (provided_post_id, provided_reaction_type) => {
        post_to_react_to = provided_post_id;
        reaction_type = provided_reaction_type;
      }
    );
  }

  function andReactionFromUserToPostIdentifiedByIdExists(and) {
    and(/^there exists a reaction to the post identified by "([^"]*)" from the user and the type of the reaction being "([^"]*)"$/,
      async (provided_post_id, provided_reaction_type) => {
        try {
          existing_reaction = await add_reaction_interactor.execute({
            post_id: provided_post_id,
            reactor_id: reactor_id,
            reaction_type: provided_reaction_type
          });
        } catch (e){
          console.log(e);
        }
      }
    );
  }

  function whenTheUserTriesToReactToPost(when) {
    when('the user tries to react to the post', async () => {
      try {
        added_or_removed_reaction = await add_reaction_interactor.execute({
          post_id: post_to_react_to,
          reactor_id: reactor_id,
          reaction_type: reaction_type
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_permanent_post_interactor = module.get<CreatePermanentPostInteractor>(PostDITokens.CreatePermanentPostInteractor);
    add_reaction_interactor = module.get<AddReactionInteractor>(ReactionDITokens.AddReactionInteractor);
    exception = undefined;
  });

  test('A logged in user reacts to a post with a like',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andPostIdAndReactionTypeAreProvided(and);
      whenTheUserTriesToReactToPost(when);
      then(
        'the reaction is added',
        () => {
          const expected_output: AddReactionOutputModel = {
            post_id: post_to_react_to,
            reactor_id: reactor_id,
            reaction_type: reaction_type
          };
          expect(added_or_removed_reaction).toBeDefined();
          expect(added_or_removed_reaction.post_id).toEqual(expected_output.post_id);
          expect(added_or_removed_reaction.reactor_id).toEqual(expected_output.reactor_id);
        },
      );
    }
  );

  test('A logged in user reacts to an unexisting post',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andPostIdAndReactionTypeAreProvided(and);
      whenTheUserTriesToReactToPost(when);
      then(
        'an error occurs: the post with the id provided does not exist',
        () => {
          expect(exception).toBeInstanceOf(AddReactionUnexistingPostException);
        },
      );
    }
  );

  test('A logged in user reacts to a post that already has a reaction from the same user',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andReactionFromUserToPostIdentifiedByIdExists(and);
      andPostIdAndReactionTypeAreProvided(and);
      whenTheUserTriesToReactToPost(when);
      then(
        'the reaction is removed',
        () => {
          const expected_output: AddReactionOutputModel = {
            post_id: post_to_react_to,
            reactor_id: reactor_id,
            reaction_type: reaction_type
          };
          expect(added_or_removed_reaction).toBeDefined();
          expect(added_or_removed_reaction.post_id).toEqual(expected_output.post_id);
          expect(added_or_removed_reaction.reactor_id).toEqual(expected_output.reactor_id);
        },
      );
    }
  );

  test('A logged in user reacts to a post with an unvalid type of reaction',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andPostIdAndReactionTypeAreProvided(and);
      whenTheUserTriesToReactToPost(when);
      then(
        'an error occurs: the type of the reaction does not match any of the available types',
        () => {
          expect(exception).toBeInstanceOf(AddReactionInvalidTypeException);
        },
      );
    }
  );
});
