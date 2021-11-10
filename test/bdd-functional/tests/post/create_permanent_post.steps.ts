import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import CreatePermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import CreatePermanentPostOutputModel from '@core/domain/post/use-case/output-model/create_permanent_post.output_model';

import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import {
  CreatePermanentPostEmptyContentException,
  CreatePermanentPostException,
} from '@core/service/post/create_permanent_post.exception';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';

import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_post_content_element';
import { PermanentPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/permanent_post_in_memory.repository';

const feature = loadFeature(
  'test/bdd-functional/features/posts/create_permanent_post.feature',
);

defineFeature(feature, (test) => {
  let post_content: PermanentPostContentElement[];
  let create_user_account_interactor: CreateUserAccountInteractor;
  let user_id: string;
  let output: CreatePermanentPostOutputModel;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let exception: CreatePermanentPostException;

  const user_1 = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

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
      exception = e;
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesTheContentOfThePost(and) {
    and(
      'the user provides the content of the post being:',
      (post_content_table: PermanentPostContentElement[]) => {
        post_content = post_content_table;
      },
    );
  }

  function whenUserTriesToCreateNewPost(when) {
    when('the user tries to create a new post',
      async () => {
        console.log(post_content);
        output = await createPost({
          id: '1',
          content: post_content,
          user_id,
        });
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
    exception = undefined;
  });

  test('A logged in user creates a permanent post successfully', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);

    then(
      'a post is then created with the content text and references provided',
      () => {
        const expected_output: CreatePermanentPostOutputModel = {
          user_id: user_id,
          content: post_content,
        };
        expect(output).toBeDefined();
        expect(output.content).toEqual(expected_output.content);
      },
    );
  });

  test('A logged in user tries to create a permanent post without any content', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);

    then(
      'an error occurs: the post to create needs to have some kind of content',
      () => {
        expect(exception).toBeInstanceOf(
          CreatePermanentPostEmptyContentException,
        );
      },
    );
  });

  test('A logged in user tries to create a permanent post composed of only text', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);

    then('a post is then created with the text provided', () => {
      const expected_output: CreatePermanentPostOutputModel = {
        user_id: user_id,
        content: post_content,
      };
      expect(output).toBeDefined();
      expect(output.user_id).toEqual(expected_output.user_id);
      expect(output.content).toEqual(expected_output.content);
    });
  });

  test('A logged in user tries to create a permanent post composed of only images', ({
    given,
    and,
    when,
    then,
  }) => {
    givenAUserExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);
    then('a post is then created with the images provided', () => {
      const expected_output: CreatePermanentPostOutputModel = {
        user_id: user_id,
        content: post_content,
      };
      expect(output).toBeDefined();
      expect(output.user_id).toEqual(expected_output.user_id);
      expect(output.content).toEqual(expected_output.content);
    });
  });
});