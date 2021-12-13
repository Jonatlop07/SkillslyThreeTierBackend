import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/interactor/create_permanent_post.interactor';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post.interactor';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/interactor/query_permanent_post_collection.interactor';
import QueryPermanentPostOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post.output_model';
import {
  NonExistentPermanentPostException,
  NonExistentUserException,
  PermanentPostException
} from '@core/domain/post/use-case/exception/permanent_post.exception';
import CreatePermanentPostInputModel from '@core/domain/post/use-case/input-model/create_permanent_post.input_model';
import QueryPermanentPostCollectionOutputModel
  from '@core/domain/post/use-case/output-model/query_permanent_post_collection.output_model';
import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_post_content_element';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import * as moment from 'moment';
import CreatePermanentPostOutputModel from '@core/domain/post/use-case/output-model/create_permanent_post.output_model';
import UpdateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/update_user_follow_request.input_model';
import { UpdateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/update_user_follow_request.interactor';
import CreateUserFollowRequestInputModel from '@core/domain/user/use-case/input-model/follow_request/create_user_follow_request.input_model';
import { CreateUserFollowRequestInteractor } from '@core/domain/user/use-case/interactor/follow_request/create_user_follow_request.interactor';
import { create } from 'domain';

const feature = loadFeature(
  'test/bdd-functional/features/post/query_permanent_post.feature',
);

defineFeature(feature, (test) => {
  let user_id: string;
  let owner_id: string;
  let existing_post_id: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor:CreatePermanentPostInteractor;
  let query_permanent_post_interactor: QueryPermanentPostInteractor;
  let query_permanent_post_collection_interactor: QueryPermanentPostCollectionInteractor;
  let update_user_follow_request_interactor: UpdateUserFollowRequestInteractor;
  let create_user_follow_request_interactor: CreateUserFollowRequestInteractor;

  let output: QueryPermanentPostOutputModel;
  let exception: PermanentPostException;

  let created_post: CreatePermanentPostOutputModel;
  let output_collection: QueryPermanentPostCollectionOutputModel;

  const user_1 = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  const user_2 = {
    email: 'newuser_1234@test.com',
    password: 'Abc1234_tr',
    name: 'Juana',
    date_of_birth: '02/01/2000',
  };

  const cont1: PermanentPostContentElement = {
    description: 'this is first post',
    reference: 'https://www.gstatic.com/webp/gallery/1.jpg',
    reference_type: 'jpg'
  };
  const cont2: PermanentPostContentElement = {
    reference: 'https://www.gstatic.com/webp/gallery/2.jpg',
    reference_type: 'jpg'
  };
  const cont3: PermanentPostContentElement = {
    reference: 'https://www.gstatic.com/webp/gallery/4.jpg',
    reference_type: 'jpg'
  };
  const post1_content: PermanentPostContentElement[] = [cont1];
  const post2_content: PermanentPostContentElement[] = [cont2, cont3];

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      return id;
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
    given(/^a user exists$/, async () => {
      user_id = await createUserAccount(user_1);
    });
  }

  function andPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)", with privacy "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
      async (post_id, post_privacy, post_owner_id, post_content_table) => {
        try {
          created_post = await createPost({
            id: post_id,
            content: post_content_table,
            user_id: post_owner_id,
            privacy: post_privacy,
          });
        } catch (e){
          console.log(e);
        }
      },
    );
  }

  function andUserIdentifiedByIdExists(and) {
    and(/^there exists a user with id being "([^"]*)"$/,
      async (post_owner_id) => {
        owner_id = post_owner_id;
        try {
          await createUserAccount(user_2);
        } catch (e){
          console.log(e);
        }
      },
    );
  }

  function andPostCollectionFromUserIdentifiedByIdExists(and) {
    and(/^there exists a collection of posts that belongs to user "([^"]*)"$/,
      async (post_owner_id) => {
        const posts: CreatePermanentPostInputModel[] = [
          { content: post1_content, user_id: post_owner_id, privacy: 'public' },
          { content: post2_content, user_id: post_owner_id, privacy: 'private' }
        ];
        for (const post of posts) {
          await createPost(post);
        }
      },
    );
  }

  function andUserProvidesIdOfThePostAndIdOfTheOwner(and) {
    and(/^the user provides the id of the post being "([^"]*)" and the id of the owner user being "([^"]*)"$/,
      (post_id, post_owner_id) => {
        existing_post_id = post_id;
        owner_id = post_owner_id;
      },
    );
  }

  function andFollowingRelationshipExists(and){
    and('there exists a following relationship between the two users',
      async() => {
        try {
          await create_user_follow_request_interactor.execute({user_id: user_id, user_destiny_id: owner_id});
          await update_user_follow_request_interactor.execute({user_id: user_id, user_destiny_id: owner_id, accept:true});
        } catch (e){
          console.log(e);
        }
      }
    );
  }

  function andUserProvidesIdOfTheOwner(and) {
    and(/^the user provides the id of the owner being "([^"]*)"$/,
      (post_owner_id) => {
        owner_id = post_owner_id;
      },
    );
  }

  function whenUserTriesQueryAPost(when) {
    when('the user tries to query the post',
      async () => {
        try {
          output = await query_permanent_post_interactor.execute({
            user_id: owner_id,
            id: existing_post_id
          });
        } catch (e){
          exception = e;
        }
      });
  }

  function whenUserTriesToQueryACollectionOfPosts(when) {
    when('the user tries to query a collection of posts',
      async () => {
        try {
          output_collection = await query_permanent_post_collection_interactor.execute({
            user_id: user_id,
            owner_id: owner_id
          });
        } catch (e){
          exception = e;
        }
      });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor,
    );
    create_user_follow_request_interactor = module.get<CreateUserFollowRequestInteractor>(
      UserDITokens.CreateUserFollowRequestInteractor,
    );
    update_user_follow_request_interactor = module.get<UpdateUserFollowRequestInteractor>(
      UserDITokens.UpdateUserFollowRequestInteractor,
    );
    create_permanent_post_interactor = module.get<CreatePermanentPostInteractor>(
      PostDITokens.CreatePermanentPostInteractor,
    );
    query_permanent_post_collection_interactor = module.get<QueryPermanentPostCollectionInteractor>(
      PostDITokens.QueryPermanentPostCollectionInteractor,
    );
    query_permanent_post_interactor = module.get<QueryPermanentPostInteractor>(
      PostDITokens.QueryPermanentPostInteractor
    );
    exception = undefined;
  });

  test('A logged in user tries to query a specific permanent post',
    ({ given, and, when, then, }) => {
      givenAUserExists(given);
      andPostIdentifiedByIdExists(and);
      andUserProvidesIdOfThePostAndIdOfTheOwner(and);
      whenUserTriesQueryAPost(when);
      then(
        'the post is then returned',
        () => {
          const expected_output: QueryPermanentPostOutputModel = {
            post_id: created_post.post_id,
            content: created_post.content,
            user_id: created_post.user_id
          };
          expect(output).toBeDefined();
          expect(output.content).toEqual(expected_output.content);
        },
      );
    }
  );

  test('A logged in user tries to query the collection of permanent posts that belong to himself',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andPostCollectionFromUserIdentifiedByIdExists(and);
      andUserProvidesIdOfTheOwner(and);
      whenUserTriesToQueryACollectionOfPosts(when);

      then(
        'the collection of posts is then returned',
        () => {
          const expected_output: QueryPermanentPostCollectionOutputModel = {
            posts: [
              {
                post_id:'1',
                content: post1_content,
                user_id: owner_id,
                privacy: 'public',
                created_at: moment().format('YYYY/MM/DD HH:mm:ss')
              },
              {
                post_id:'2',
                content: post2_content,
                user_id: owner_id,
                privacy: 'private',
                created_at: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            ]
          };
          expect(output_collection).toBeDefined();
          expect(output_collection.posts).toEqual(expected_output.posts);
        },
      );
    }
  );


  test('A logged in user tries to query the collection of permanent posts that belong to another user who is friends with them',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserIdentifiedByIdExists(and);
      andPostCollectionFromUserIdentifiedByIdExists(and);
      andFollowingRelationshipExists(and);
      andUserProvidesIdOfTheOwner(and);
      whenUserTriesToQueryACollectionOfPosts(when);

      then(
        'the collection of all posts is then returned',
        () => {
          const expected_output: QueryPermanentPostCollectionOutputModel = {
            posts: [
              {
                post_id:'1',
                content: post1_content,
                user_id: owner_id,
                privacy: 'public',
                created_at: moment().format('YYYY/MM/DD HH:mm:ss')
              },
              {
                post_id:'2',
                content: post2_content,
                user_id: owner_id,
                privacy: 'private',
                created_at: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            ]
          };
          expect(output_collection).toBeDefined();
          expect(output_collection.posts).toEqual(expected_output.posts);
        },
      );
    }
  );

  test('A logged in user tries to query the collection of permanent posts that belong to another user who is not friends with them',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserIdentifiedByIdExists(and);
      andPostCollectionFromUserIdentifiedByIdExists(and);
      andUserProvidesIdOfTheOwner(and);
      whenUserTriesToQueryACollectionOfPosts(when);

      then(
        'the collection of posts that are public is returned',
        () => {
          const expected_output: QueryPermanentPostCollectionOutputModel = {
            posts: [
              {
                post_id:'1',
                content: post1_content,
                user_id: owner_id,
                privacy: 'public',
                created_at: moment().format('YYYY/MM/DD HH:mm:ss')
              }
            ]
          };
          expect(output_collection).toBeDefined();
          expect(output_collection.posts).toEqual(expected_output.posts);
        },
      );
    }
  );


  test('A logged in user tries to query the collection of permanent posts that belong to another user that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesIdOfTheOwner(and);
      whenUserTriesToQueryACollectionOfPosts(when);

      then('an error occurs: the user with the provided id does not exist', () => {
        expect(exception).toBeInstanceOf(
          NonExistentUserException
        );
      });
    }
  );

  test('A logged in user tries to query a permanent post that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserIdentifiedByIdExists(and);
      andUserProvidesIdOfThePostAndIdOfTheOwner(and);
      whenUserTriesQueryAPost(when);

      then('an error occurs: the post with the provided id does not exist', () => {
        expect(exception).toBeInstanceOf(
          NonExistentPermanentPostException
        );
      });
    }
  );

  test('A logged in user tries to query a permanent post from a user that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesIdOfThePostAndIdOfTheOwner(and);
      whenUserTriesQueryAPost(when);

      then('an error occurs: the user with the provided id does not exist', () => {
        expect(exception).toBeInstanceOf(
          NonExistentUserException
        );
      });
    }
  );
});
