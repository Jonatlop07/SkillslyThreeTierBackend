import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/create_permanent_post.interactor';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import { CreateCommentInCommentInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_comment.interactor';
import { GetCommentsInCommentInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_comment.interactor';
import { GetCommentsInCommentOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_comment.output_model';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import CreateCommentInCommentInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_comment.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';

const feature = loadFeature('test/bdd-functional/features/comment/get_comments_in_comment.feature');
defineFeature(feature, (test) => {
  let userID: string;
  let ancestorCommentID: string;
  let numberOfComments: number;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createPermanentPostInteractor: CreatePermanentPostInteractor;
  let createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor;
  let createCommentInCommentInteractor: CreateCommentInCommentInteractor;
  let getCommentsInCommentInteractor: GetCommentsInCommentInteractor;

  let output: GetCommentsInCommentOutputModel;

  const user_1 = createUserMock();
  const post_1 = {
    id: '1',
    content: [
      {
        description: 'This is a description',
        reference: 'https://www.google.com',
        reference_type: 'jpg',
      },
    ],
    owner_id: '1',
    privacy: 'public'
  };
  const comment_1 = {
    ownerID: '1',
    postID: '1',
    comment: 'A comment in a permanent post test',
    timestamp: '2020-01-01T00:00:00',
  };

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await createUserAccountInteractor.execute(input);
      userID = id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createPost(input: CreatePermanentPostInputModel) {
    try {
      await createPermanentPostInteractor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  async function createCommentInPost(input: CreateCommentInPermanentPostInputModel) {
    try {
      const { commentID } = await createCommentInPermanentPostInteractor.execute(input);
      ancestorCommentID = commentID;
    } catch (e) {
      console.log(e);
    }
  }

  const givenAnUserAPermanentPostAndAComment = (given) => {
    given('an existing user, a permanent post and a comment in that post', async () => {
      await createUserAccount(user_1);
      await createPost(post_1);
      await createCommentInPost(comment_1);
    });
  };

  const andThereExistsCommentsInComment = (and) => {
    and('there exists comments in the comment, being:', async (comments_table: Array<Partial<CreateCommentInCommentInputModel>>) => {
      numberOfComments = comments_table.length;
      for (const comment of comments_table) {
        const input = {
          userID: userID,
          ancestorCommentID: ancestorCommentID,
          comment: comment.comment,
          timestamp: comment.timestamp,
        };
        await createCommentInCommentInteractor.execute(input);
      }
    });
  };

  const andThereAreNoCommentsInTheComment = (and) => {
    and('there are no comments in the comment', () => {
      numberOfComments = 0;
    });
  };

  const whenTheUserGetsCommentsInComment = (when) => {
    when('the user tries to get all comments of the comment', async () => {
      try {
        output = await getCommentsInCommentInteractor.execute(undefined);
      } catch (e) {
        console.log(e);
      }
    });
  };

  beforeEach(async () => {
    const module = await createTestModule();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor,
    );
    createPermanentPostInteractor = module.get<CreatePermanentPostInteractor>(
      PostDITokens.CreatePermanentPostInteractor,
    );
    createCommentInPermanentPostInteractor = module.get<CreateCommentInPermanentPostInteractor>(
      CommentDITokens.CreateCommentInPermanentPostInteractor,
    );
    createCommentInCommentInteractor = module.get<CreateCommentInCommentInteractor>(
      CommentDITokens.CreateCommentInCommentInteractor,
    );
    getCommentsInCommentInteractor = module.get<GetCommentsInCommentInteractor>(
      CommentDITokens.GetCommentsInCommentInteractor,
    );
    output = undefined;
  });


  test('A logged user tries to get all comments of a comment in a permanent post', ({ given, and, when, then }) => {
    givenAnUserAPermanentPostAndAComment(given);
    andThereExistsCommentsInComment(and);
    whenTheUserGetsCommentsInComment(when);
    then('the user should get all the comments of the comment', () => {
      expect(output).toBeDefined();
      expect(output.comments.length).toBe(numberOfComments);
    });
  });

  test('A logged user tries to get all comments of a comment, but the comment has no comments', ({ given, and, when, then }) => {
    givenAnUserAPermanentPostAndAComment(given);
    andThereAreNoCommentsInTheComment(and);
    whenTheUserGetsCommentsInComment(when);
    then('an error occurs: there are not comments in the comment', () => {
      expect(output.comments.length).toBe(0);
      expect(numberOfComments).toBe(0);
    });
  });

})
;
