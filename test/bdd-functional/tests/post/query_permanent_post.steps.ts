import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_post_content_element';
import QueryPermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import CreatePermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import QueryPermanentPostOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post.output_model';
import QueryPermanentPostCollectionOutputModel from '@core/domain/post/use-case/output-model/query_permanent_post_collection.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { PermanentPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/permanent_post_in_memory.repository';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { QueryPermanentPostException, QueryPermanentPostUnexistingPostException, QueryPermanentPostUnexistingUserException } from '@core/service/post/query_permanent_post.exception';
import { QueryPermanentPostCollectionService } from '@core/service/post/query_permanent_post_collection.service';
import { QueryPermanentPostCollectionInteractor } from '@core/domain/post/use-case/query_permanent_post_collection.interactor';
import { QueryPermanentPostService } from '@core/service/post/query_permanent_post.service';
import { QueryPermanentPostInteractor } from '@core/domain/post/use-case/query_permanent_post.interactor';
import * as moment from 'moment';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';

const feature = loadFeature(
  'test/bdd-functional/features/posts/query_permanent_post.feature',
);

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let user_id: string;
  let create_permanent_post_interactor:CreatePermanentPostInteractor;
  let owner_id: string;
  let output: QueryPermanentPostOutputModel;
  let created_post: CreatePermanentPostInputModel;
  let output_collection: QueryPermanentPostCollectionOutputModel;
  let existing_post_id: string;
  let exception: QueryPermanentPostException;
  let query_permanent_post_interactor: QueryPermanentPostInteractor;
  let query_permanent_post_collection_interactor: QueryPermanentPostCollectionInteractor;
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

  const cont1: PermanentPostContentElement = {description: 'this is first post', reference: 'https://www.gstatic.com/webp/gallery/1.jpg', reference_type: 'jpg'};
  const cont2: PermanentPostContentElement = {reference: 'https://www.gstatic.com/webp/gallery/2.jpg', reference_type: 'jpg'};
  const cont3: PermanentPostContentElement = {reference: 'https://www.gstatic.com/webp/gallery/4.jpg', reference_type: 'jpg'};
  const post1_content: PermanentPostContentElement[] = [cont1];
  const post2_content: PermanentPostContentElement[] = [cont2, cont3];

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
      return user_id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createPost(input: CreatePermanentPostInputModel) {
    try {
      return await create_permanent_post_interactor.execute(input);
    } catch (e) {
      exception = e;
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
      async (post_id, post_owner_id, post_content_table) => {
        try {
          created_post = await createPost({
            id: post_id,
            content: post_content_table,
            user_id: post_owner_id
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
        owner_id = post_owner_id;
        const posts: CreatePermanentPostInputModel[] = [{ content: post1_content, user_id: owner_id}, {content: post2_content, user_id: owner_id}];
        await posts.forEach(async (post)=>{
          try {
            await createPost(post);
          } catch (e){
            console.log(e);
          }
        });
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
          console.log(e);
        }
      });
  }

  function whenUserTriesToQueryACollectionOfPosts(when) {
    when('the user tries to query a collection of posts',
      async () => {
        try {
          output_collection = await query_permanent_post_collection_interactor.execute({
            user_id: owner_id
          });
        } catch (e){
          exception = e;
          console.log(e);
        }
      });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserAccountInteractor,
          useFactory: (gateway) => new CreateUserAccountService(gateway),
          inject: [UserDITokens.UserRepository],
        },
        {
          provide: UserDITokens.UserRepository,
          useFactory: () => new UserInMemoryRepository(new Map()),
        },
        {
          provide: PostDITokens.CreatePermanentPostInteractor,
          useFactory: (gateway) => new CreatePermanentPostService(gateway),
          inject: [PostDITokens.PermanentPostRepository],
        },
        {
          provide: PostDITokens.QueryPermanentPostInteractor,
          useFactory: (post_gateway, user_gateway) => new QueryPermanentPostService(post_gateway, user_gateway),
          inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
        },
        {
          provide: PostDITokens.QueryPermanentPostCollectionInteractor,
          useFactory: (post_gateway, user_gateway) => new QueryPermanentPostCollectionService(post_gateway, user_gateway),
          inject: [PostDITokens.PermanentPostRepository, UserDITokens.UserRepository],
        },
        {
          provide: PostDITokens.PermanentPostRepository,
          useFactory: () => new PermanentPostInMemoryRepository(new Map()),
        },
      ],
    }).compile();

    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor,
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

  test('A logged in user tries to query a specific permanent post', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andPostIdentifiedByIdExists(and);
    andUserProvidesIdOfThePostAndIdOfTheOwner(and);
    whenUserTriesQueryAPost(when);
    then(
      'the post is then returned',
      () => {
        const expected_output: QueryPermanentPostInputModel = {
          content: created_post.content,
          user_id: created_post.user_id
        };
        expect(output).toBeDefined();
        expect(output.content).toEqual(expected_output.content);
      },
    );
  });

  test('A logged in user tries to query the collection of permanent posts that belong to another user or himself', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserIdentifiedByIdExists(and);
    andPostCollectionFromUserIdentifiedByIdExists(and);
    andUserProvidesIdOfTheOwner(and);
    whenUserTriesToQueryACollectionOfPosts(when);

    then(
      'the collection of posts is then returned',
      () => {
        const expected_output: QueryPermanentPostCollectionOutputModel = {
          posts: [{post_id:'1', content: post1_content, user_id: owner_id, created_at: moment().format('DD/MM/YYYY')}, {post_id:'2', content: post2_content, user_id: owner_id, created_at: moment().format('DD/MM/YYYY')}]
        };
        expect(output_collection).toBeDefined();
        expect(output_collection.posts).toEqual(expected_output.posts);
      },
    );
  });

  test('A logged in user tries to query the collection of permanent posts that belong to another user that does not exist', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesIdOfTheOwner(and);
    whenUserTriesToQueryACollectionOfPosts(when);

    then('an error occurs: the user with the provided id does not exist', () => {
      expect(exception).toBeInstanceOf(
        QueryPermanentPostUnexistingUserException
      );
    });
  });

  test('A logged in user tries to query a permanent post that does not exist', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserIdentifiedByIdExists(and);
    andUserProvidesIdOfThePostAndIdOfTheOwner(and);
    whenUserTriesQueryAPost(when);

    then('an error occurs: the post with the provided id does not exist', () => {
      expect(exception).toBeInstanceOf(
        QueryPermanentPostUnexistingPostException
      );
    });
  });

  test('A logged in user tries to query a permanent post from a user that does not exist', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesIdOfThePostAndIdOfTheOwner(and);
    whenUserTriesQueryAPost(when);

    then('an error occurs: the user with the provided id does not exist', () => {
      expect(exception).toBeInstanceOf(
        QueryPermanentPostUnexistingUserException
      );
    });
  });
});