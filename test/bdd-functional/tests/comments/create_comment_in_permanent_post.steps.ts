import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreatePermanentPostInputModel from '@core/domain/permanent-post/use-case/input-model/create_permanent_post.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreatePermanentPostInteractor } from '@core/domain/permanent-post/use-case/interactor/create_permanent_post.interactor';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import CreateCommentInPermanentPostOutputModel
  from '@core/domain/comment/use-case/output_model/create_comment_in_permanent_post.output_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/permanent-post/di/post_di_tokens';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import {
  CommentException,
  CommentInvalidDataFormatException,
} from '@core/domain/comment/use-case/exception/comment.exception';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/comment/create_comment_in_permanent_post.feature');

defineFeature(feature, (test) => {
  let comment: string;
  let timestamp: string;
  let userID: string;
  let postID: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createPermanentPostInteractor: CreatePermanentPostInteractor;
  let createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor;

  let output: CreateCommentInPermanentPostOutputModel = undefined;
  let exception: CommentException;

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
      const { created_permanent_post } = await createPermanentPostInteractor.execute(input);
      postID = created_permanent_post.post_id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createComment(input: CreateCommentInPermanentPostInputModel) {
    try {
      output = await createCommentInPermanentPostInteractor.execute(input);
    } catch (e) {
      exception = e;
    }
  }


  const givenAnExistingUserAndAPost = (given) => {
    given('an existing user and a permanent post', async () => {
      await createUserAccount(user_1);
      await createPost(post_1);
    });
  };

  const andUserProvidesCommentData = (and) => {
    and(/^user provides comment data: "([^"]*)" and "([^"]*)"$/, (inputComment: string, inputTimestamp: string) => {
      comment = inputComment;
      timestamp = inputTimestamp;
    });
  };

  const whenUserTriesAddAComment = (when) => {
    when('user tries to add a comment to the post', async () => {
      const input = {
        ownerID: userID,
        postID: postID,
        comment: comment,
        timestamp: timestamp,
      };
      await createComment(input);
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
    exception = undefined;
    output = undefined;
  });


  test('A logged user tries to add a comment in a permanent post',
    ({ given, and, when, then }) => {
      givenAnExistingUserAndAPost(given);
      andUserProvidesCommentData(and);
      whenUserTriesAddAComment(when);
      then('the comment is added to post', () => {
        expect(output).toBeDefined();
      });
    });

  test('A logged user tries to add a comment in a permanent post with a void content',
    ({ given, and, when, then }) => {
      givenAnExistingUserAndAPost(given);
      andUserProvidesCommentData(and);
      whenUserTriesAddAComment(when);
      then('an error occurs: the comment must contain at least one character', () => {
        expect(exception).toBeInstanceOf(CommentInvalidDataFormatException);
        expect(output).toBeUndefined();
      });
    });

  test('A logged user tries to add a comment in a permanent post with a timestamp in an invalid format',
    ({ given, and, when, then }) => {
      givenAnExistingUserAndAPost(given);
      andUserProvidesCommentData(and);
      whenUserTriesAddAComment(when);
      then('an error occurs: the comment timestamp must be in the format "YYYY-MM-DDTHH:MM:SS"', () => {
        expect(exception).toBeInstanceOf(CommentInvalidDataFormatException);
        expect(output).toBeUndefined();
      });
    });


});
