import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreatePermanentPostInputModel from '@core/domain/post/use-case/input-model/create_permanent_post.input_model';
import { CreateCommentInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/create_comment_in_permanent_post.interactor';
import CreateCommentInPermanentPostInputModel
  from '@core/domain/comment/use-case/input-model/create_comment_in_permanent_post.input_model';
import { GetCommentsInPermanentPostInteractor } from '@core/domain/comment/use-case/interactor/get_comments_in_permanent_post.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { CommentDITokens } from '@core/domain/comment/di/commen_di_tokens';
import {
  CommentException,
  ThereAreNoCommentsException,
} from '@core/domain/comment/use-case/exception/comment.exception';
import { GetCommentsInPermanentPostOutputModel } from '@core/domain/comment/use-case/output_model/get_comments_in_permanent_post.output_model';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/comment/get_comments_in_permanent_post.feature');

defineFeature(feature, (test) => {

  let userID: string;
  let postID: string;
  let numberOfComments: number;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createPermanentPostInteractor: CreatePermanentPostInteractor;
  let createCommentInPermanentPostInteractor: CreateCommentInPermanentPostInteractor;
  let getCommentsInPermanentPostInteractor: GetCommentsInPermanentPostInteractor;

  let output: Array<CreateCommentInPermanentPostInputModel> | Array<GetCommentsInPermanentPostOutputModel>;
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
    user_id: '1',
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
      const { post_id } = await createPermanentPostInteractor.execute(input);
      postID = post_id;
    } catch (e) {
      console.log(e);
    }
  }

  const givenAnExistingUserAndAPost = (given) => {
    given('an existing user and a permanent post', async () => {
      await createUserAccount(user_1);
      await createPost(post_1);
    });
  };

  const andThereExistsCommentsInThePost = (and) => {
    and('there exists comments in the post, being:', async (comments_table: Array<Partial<CreateCommentInPermanentPostInputModel>>) => {
      numberOfComments = comments_table.length;
      for (const comment of comments_table) {
        const input = {
          userID: userID,
          postID: postID,
          comment: comment['comment'],
          timestamp: comment['timestamp'],
        };
        await createCommentInPermanentPostInteractor.execute(input);
      }
    });
  };

  const andThereAreNoCommentsInThePost = (and) => {
    and('there are no comments in the post', () => {
      numberOfComments = 0;
    });
  };


  const whenUserTriesToGetAllComments = (when) => {
    when('the user tries to get all comments of the post', async () => {
      try {
        output = await getCommentsInPermanentPostInteractor.execute(undefined);
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
    getCommentsInPermanentPostInteractor = module.get<GetCommentsInPermanentPostInteractor>(
      CommentDITokens.GetCommentsInPermamentPostInteractor,
    );
    exception = undefined;
    output = [];
  });


  test('A logged user tries to get all comments of a permanent post', ({ given, and, when, then }) => {
    givenAnExistingUserAndAPost(given);
    andThereExistsCommentsInThePost(and);
    whenUserTriesToGetAllComments(when);
    then('the user should get all the comments in the post', () => {
      expect(output).toBeDefined();
      expect(output.length).toBe(numberOfComments);
    });
  });

  test('A logged user tries to get all comments of a permanent post, but the post has no comments',
    ({ given, and, when, then }) => {
      givenAnExistingUserAndAPost(given);
      andThereAreNoCommentsInThePost(and);
      whenUserTriesToGetAllComments(when);
      then('an error occurs: there are not comments in the post', () => {
        expect(output.length).toBe(numberOfComments);
      });
    });

});
