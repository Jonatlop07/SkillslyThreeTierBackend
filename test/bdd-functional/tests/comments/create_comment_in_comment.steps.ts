import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/create_permanent_post.interactor';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import CreateCommentInCommentInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_comment.input_model';
import { CreateCommentInCommentInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_comment.interactor';
import CreateCommentInCommentOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_comment.output_model';
import { CommentException } from '@core/domain/comment/use-case/exception/comment.exception';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';

const feature = loadFeature('test/bdd-functional/features/comment/create_comment_in_comment.feature');

defineFeature(feature, (test) => {
  let comment: string;
  let timestamp: string;
  let userID: string;
  let ancestorCommentID: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createPermanentPostInteractor: CreatePermanentPostInteractor;
  let createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor;
  let createCommentInCommentInteractor: CreateCommentInCommentInteractor;

  let output: CreateCommentInCommentOutputModel = undefined;
  let exception: CommentException;

  const user_1 = createUserMock();
  const post_1 = {
    id: '1',
    content: [
      {
        description: 'This is a description of post 1',
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
    comment: 'Test of my comment in post 1',
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

  async function createComment(input: CreateCommentInPermanentPostInputModel) {
    try {
      const { commentID } = await createCommentInPermanentPostInteractor.execute(input);
      // console.log(await createCommentInPermanentPostInteractor.execute(input));
      ancestorCommentID = commentID;
    } catch (e) {
      exception = e;
    }
  }

  async function createCommentInComment(input: CreateCommentInCommentInputModel) {
    try {
      output = await createCommentInCommentInteractor.execute(input);
    } catch (e) {
      exception = e;
    }
  }

  const givenUserPostAndComment = (given) => {
    given('an existing user, a permanent post and a comment', async () => {
      await createUserAccount(user_1);
      await createPost(post_1);
      await createComment(comment_1);
    });
  };

  const andUserProvidesCommentData = (and) => {
    and(/^user provides comment data: "([^"]*)" and "([^"]*)"$/, (inputComment: string, inputTimestamp: string) => {
      comment = inputComment;
      timestamp = inputTimestamp;
    });
  };

  const whenUserAddsComment = (when) => {
    when('user tries to add a comment to the post comment', async () => {
      const input = {
        userID: userID,
        ancestorCommentID: ancestorCommentID,
        comment: comment,
        timestamp: timestamp,
      };
      try {
        await createCommentInComment(input);
      } catch (e) {
        exception = e;
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
    exception = undefined;
    output = undefined;
  });

  test('A logged user tries to add a comment to another comment', ({ given, and, when, then }) => {
    givenUserPostAndComment(given);
    andUserProvidesCommentData(and);
    whenUserAddsComment(when);
    then('the comment is added to the another comment', () => {
      expect(output).toBeDefined();
    });
  });

  test('A logged user tries to add a comment to another comment with a void content', ({ given, and, when, then }) => {
    givenUserPostAndComment(given);
    andUserProvidesCommentData(and);
    whenUserAddsComment(when);
    then('an error occurs: the comment must contain at least one character', () => {
      expect(output).toBeUndefined();
      expect(exception).toBeInstanceOf(CommentException);
    });
  });

  test('A logged user tries to add a comment to another comment with a timestamp in an invalid format', ({ given, and, when, then }) => {
    givenUserPostAndComment(given);
    andUserProvidesCommentData(and);
    whenUserAddsComment(when);
    then('an error occurs: the comment timestamp must be in the format "YYYY-MM-DDTHH:MM:SS"', () => {
      expect(output).toBeUndefined();
      expect(exception).toBeInstanceOf(CommentException);
    });
  });


});
