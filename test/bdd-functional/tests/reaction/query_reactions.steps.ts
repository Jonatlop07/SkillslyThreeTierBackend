import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/create_permanent_post.interactor';
import { ReactionDITokens } from '@core/domain/reaction/di/reaction_di_tokens';
import { QueryReactionsUnexistingPostException, ReactionException } from '@core/domain/reaction/use_case/exception/reaction.exception';
import AddReactionInputModel from '@core/domain/reaction/use_case/input-model/add_reaction.input_model';
import { AddReactionInteractor } from '@core/domain/reaction/use_case/interactor/add_reaction.interactor';
import { QueryReactionsInteractor } from '@core/domain/reaction/use_case/interactor/query_reactions.interactor';
import { QueryReactionsOutputModel } from '@core/domain/reaction/use_case/output-model/query_reactions.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/reaction/query_reactions.feature');

defineFeature(feature, (test) => {
  let post_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let add_reaction_interactor: AddReactionInteractor;
  let query_reactions_interactor: QueryReactionsInteractor;
  let reactions: QueryReactionsOutputModel;
  let exception: ReactionException = undefined;

  const user_1 = createUserMock();

  async function addReaction(input: AddReactionInputModel) {
    try {
      await add_reaction_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

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
      await createUserAccount(user_1);
    });
  }

  function andAPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
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

  function andPostIdentifiedByIdHasReactions(and) {
    and(/^there exists a set of reactions to the post identified by "([^"]*)"$/,
      async (provided_post_id) => {
        try {
          await addReaction({post_id: provided_post_id, reactor_id: '1', reaction_type: 'like'});
          await addReaction({post_id: provided_post_id, reactor_id: '2', reaction_type: 'like'});
          await addReaction({post_id: provided_post_id, reactor_id: '3', reaction_type: 'interested'});
          await addReaction({post_id: provided_post_id, reactor_id: '4', reaction_type: 'fun'});
        } catch (e){
          console.log(e);
        }
      }
    );
  }

  function andPostIdIsProvided(and) {
    and(/^the user provides the id of the post being "([^"]*)"$/,
      (provided_post_id) => {
        post_id = provided_post_id;
      }
    );
  }

  function whenTheUserTriesToQueryPostReactions(when) {
    when('the user tries to query the reactions from the post', async () => {
      try {
        reactions = await query_reactions_interactor.execute({
          post_id: post_id,
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
    query_reactions_interactor = module.get<QueryReactionsInteractor>(ReactionDITokens.QueryReactionsInteractor);
    exception = undefined;
  });

  test('A logged in user tries to query the reactions from a post',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andPostIdentifiedByIdHasReactions(and);
      andPostIdIsProvided(and);
      whenTheUserTriesToQueryPostReactions(when);
      then(
        'the reactions are returned separated by types',
        () => {
          const expected_output: QueryReactionsOutputModel = {
            reactions: [{
              reactor_id: '1',
              post_id: '1',
              reaction_type: 'like'
            }, {
              reactor_id: '2',
              post_id: '1',
              reaction_type: 'like'
            }, {
              reactor_id: '3',
              post_id: '1',
              reaction_type: 'interested'
            }, {
              reactor_id: '4',
              post_id: '1',
              reaction_type: 'fun'
            }]
          };
          expect(reactions).toBeDefined();
          expect(reactions).toEqual(expected_output);
        },
      );
    }
  );

  test('A logged in user tries to query the reactions from an unexisting post',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andPostIdIsProvided(and);
      whenTheUserTriesToQueryPostReactions(when);
      then(
        'an error occurs: the post with the id provided does not exist hence the user can\'t get the reactions',
        () => {
          expect(exception).toBeInstanceOf(QueryReactionsUnexistingPostException);
        },
      );
    }
  );
});
