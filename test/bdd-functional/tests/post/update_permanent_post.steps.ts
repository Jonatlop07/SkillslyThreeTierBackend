import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/user_in_memory.repository';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { UpdatePermanentPostInteractor } from '@core/domain/post/use-case/update_permanent_post.interactor';
import { UpdatePermanentPostOutputModel } from '@core/domain/post/use-case/output-model/update_permanent_post.output_model';
import { UpdatePermanentPostException } from '@core/service/post/update_permanent_post.exception';
import { UpdatePermanentPostService } from '@core/service/post/update_permanent_post.service';
import {
  EmptyPermanentPostContentException,
  NonExistentPermanentPostException, UnauthorizedPermanentPostContentException
} from '@core/service/post/permanent_post.exception';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';
import { CreatePermanentPostInteractor } from '@core/domain/post/use-case/create_permanent_post.interactor';
import { CreatePermanentPostService } from '@core/service/post/create_permanent_post.service';
import { PermanentPostContentElement } from '@core/domain/post/entity/type/permanent_content_post_element';
import { PermanentPostInMemoryRepository } from '@infrastructure/adapter/persistence/in-memory/permanent_post_in_memory.repository';

const feature = loadFeature('test/bdd-functional/features/post/update_permanent_post.feature');

defineFeature(feature, (test) => {
  const user_1_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  const user_2_mock: CreateUserAccountInputModel = {
    ...user_1_mock,
    email: 'newuser_124@test.com'
  };

  let user_id: string;
  let owner_id: string;
  let post_to_update_id: string;
  let post_new_content: PermanentPostContentElement[];

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_permanent_post_interactor: CreatePermanentPostInteractor;
  let update_permanent_post_interactor: UpdatePermanentPostInteractor;
  let output: UpdatePermanentPostOutputModel;
  let exception: UpdatePermanentPostException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = owner_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given('a user exists', async () => {
      await createUserAccount(user_1_mock);
    });
  }

  function andAPostIdentifiedByIdExists(and) {
    and(/^there exists a post identified by "([^"]*)", and that belongs to user "([^"]*)", with content:$/,
      async (post_id, post_owner_id, post_content_table) => {
        try {
          await create_permanent_post_interactor.execute({
            id: post_id,
            content: post_content_table,
            user_id: owner_id
          });
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andAPostIdIsProvided(and) {
    and(/^the user provides the post identified by "([^"]*)"$/,
      (provided_post_id) => {
        post_to_update_id = provided_post_id;
      }
    );
  }

  function andTheUserProvidesNewContentOfThePost(and) {
    and('the user provides the new content of the post being:',
      (post_new_content_table) => {
        post_new_content = post_new_content_table;
      }
    );
  }

  function whenTheUserTriesToUpdateThePost(when) {
    when('the user tries to update the post', async () => {
      try {
        output = await update_permanent_post_interactor.execute({
          id: post_to_update_id,
          content: post_new_content,
          user_id
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  function thenThePostIsUpdatedWithTheContentProvided(then) {
    then('the post is updated with the new content provided', () => {
      expect(output).toBeDefined();
    });
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserAccountInteractor,
          useFactory: (gateway) => new CreateUserAccountService(gateway),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UserRepository,
          useFactory: () => new UserInMemoryRepository(new Map())
        },
        {
          provide: PostDITokens.UpdatePermanentPostInteractor,
          useFactory: (gateway) => new UpdatePermanentPostService(gateway),
          inject: [PostDITokens.PermanentPostRepository]
        },
        {
          provide: PostDITokens.CreatePermanentPostInteractor,
          useFactory: (gateway) => new CreatePermanentPostService(gateway),
          inject: [PostDITokens.PermanentPostRepository]
        },
        {
          provide: PostDITokens.PermanentPostRepository,
          useFactory: () => new PermanentPostInMemoryRepository(new Map())
        },
      ]
    }).compile();

    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    update_permanent_post_interactor = module.get<UpdatePermanentPostInteractor>(PostDITokens.UpdatePermanentPostInteractor);
  });

  beforeEach(() => {
    exception = undefined;
  });

  test('A logged in user updates a permanent post successfully',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheContentProvided(then);
    }
  );
  test('A logged in user tries to create a permanent post without any content',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      then('an error occurs: the post to create needs to have some kind of content', () => {
        expect(exception).toBeInstanceOf(EmptyPermanentPostContentException);
      });
    }
  );
  test('A logged in user tries to update a permanent post with only text',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheContentProvided(then);
    }
  );
  test('A logged in user tries to update a permanent post with only multimedia content',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdentifiedByIdExists(and);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      thenThePostIsUpdatedWithTheContentProvided(then);
    }
  );
  test('A logged in user tries to update a permanent post that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      then('an error occurs: the post with the provided id does not exist', () => {
        expect(exception).toBeInstanceOf(NonExistentPermanentPostException);
      });
    }
  );
  test('A logged in user tries to update a permanent post that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      and(/^another user exists with id "([^"]*)"$/, async (id) => {
        owner_id = id;
        await createUserAccount(user_2_mock);
      });
      andAPostIdIsProvided(and);
      andTheUserProvidesNewContentOfThePost(and);
      whenTheUserTriesToUpdateThePost(when);
      then('an error occurs: an error occurs: the post with the provided id does not belong to the user', () => {
        expect(exception).toBeInstanceOf(UnauthorizedPermanentPostContentException);
      });
    }
  );
});
