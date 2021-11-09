import { loadFeature, defineFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import CreatePermanentPostInputModel from '@core/domain/post/input-model/create_permanent_post.input_model';
import CreatePermanentPostOutputModel from '@core/domain/post/use-case/output-model/create_permanent_post.output_model';

import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import { CreatePermanentPostEmptyContentException, CreatePermanentPostException } from '@core/service/post/create_permanent_post.exception';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';

import { PostDITokens } from '@core/domain/post/di/permanent_post_di_tokens';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';

const feature = loadFeature(
  'test/bdd-functional/features/posts/create_permanent_post.feature',
);

defineFeature(feature, (test) => {

  let post_description: string;
  let post_references: string[];
  let post_reference_types: string[];
  let create_user_account_interactor: CreateUserAccountInteractor;
  let user_id : string;
  let output: CreatePermanentPostOutputModel;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let exception: CreatePermanentPostException;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
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
          inject: [PostDITokens.PostRepository],
        },
        {
          provide: PostDITokens.PostRepository,
          useFactory: () => new PostInMemoryRepository(new Map()),
        }
      ],
    }).compile();

    create_user_account_interactor = module.get<CreateUserAccountService>(
      UserDITokens.CreateUserAccountInteractor,
    );
    exception = undefined;
  });


  function givenUserWithIdExists(given){
    given(/^a user with the id "1" exists$/,
      (input_user_id: string) => {
        user_id = '1';
      });
  }

  function andUserProvidesTheContentOfThePost(and){
    and(/^the data of the account to create: "([^"]*)","([^"]*)","([^"]*)"$/, (input_post_description, input_post_reference,input_post_reference_type) => {
      post_description = input_post_description;
      post_references = input_post_reference;
      post_reference_types = input_post_reference_type;
    });
  }

  function whenUserTriesToCreateNewPost (when){
    when('the user tries to create a new post'), async () => {
    try{
      output = await createPost({
        post_description,
        post_references,
        post_reference_types
      });
    }catch(e){
      console.log(e);
    };
  }


  test('A logged in user creates a permanent post successfully', ({
    given,and,when,then,
  }) => {
    givenUserWithIdExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);

    then(
      'a post is then created with the content text and references provided',
      () => {
        const expected_output: CreatePermanentPostOutputModel = { post_description, post_references, post_reference_types };
        expect(output).toBeDefined();
        expect(output.post_description).toEqual(expected_output.post_description);
        expect(output.post_references).toEqual(expected_output.post_references);
        expect(output.post_reference_types).toEqual(expected_output.post_reference_types);
      });
    });

  test('A logged in user tries to create a permanent post without any content',({
    given,when,then,
  }) => {
      givenUserWithIdExists(given);
      whenUserTriesToCreateNewPost(when);

      then(
        'an error occurs: the post to create needs to have some kind of content',
        () => {
          expect(exception).toBeInstanceOf(CreatePermanentPostEmptyContentException);
      });
    });

  test('A logged in user tries to create a permanent post composed of only text', ({
    given,and,when,then,
  }) => {
    givenUserWithIdExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);

    then(
      'a post is then created with the text provided',
      () => {
        const expected_output: CreatePermanentPostOutputModel = { post_description: post_description };
        expect(output).toBeDefined();
        expect(output.post_description).toEqual(expected_output.post_description)
        // expect(output.post_references).toBeNull();
      });
    });

  test('A logged in user tries to create a permanent post composed of only images', ({
    given,and,when,then,
  }) => {
    givenUserWithIdExists(given);
    andUserProvidesTheContentOfThePost(and);
    whenUserTriesToCreateNewPost(when);
    then(
      'a post is then created with the text provided',
      () => {
        const expected_output: CreatePermanentPostOutputModel = { post_references: post_references, post_reference_types: post_reference_types }
        expect(output).toBeDefined();
        expect(output.post_references).toEqual(expected_output.post_references);
        expect(output.post_reference_types).toEqual(expected_output.post_reference_types);
      });
    });

  }


