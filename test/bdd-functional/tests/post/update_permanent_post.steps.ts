import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import { CreateUserAccountException } from '@core/service/user/create_user_account.exception';

const feature = loadFeature('test/bdd-functional/features/post/update_permanent_post.feature');

defineFeature(feature, (test) => {
  let update_permanent_post_interactor: UpdatePermanentPostInteractor;
  let output: UpdatePermanentPostOutputModel;
  let exception:UpdatePermanentPostException = undefined;

  function givenUserExistsWithId(given) {
    given(/^a user identified by "([^"]*)" exists$/);
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PostDITokens.UpdatePermanentPostInteractor,
          useFactory: (gateway) => new UpdatePermanentPostService(gateway),
          inject: [PostDITokens.PostRepository]
        },
        {
          provide: PostDITokens.PostRepository,
          useFactory: () => new PostInMemoryRepository(new Map())
        },
      ]
    }).compile();

    update_permanent_post_interactor = module.get<UpdatePermanentPostService>(PostDITokens.UpdatePermanentPostInteractor);
  });

  beforeEach(() => {
    exception = undefined;
  });

  test('A logged in user updates a permanent post successfully',
    ({given, and, when, then}) => {

    }
  );
  test('A logged in user tries to create a permanent post without any content',
    ({}) => {

    }
  );
  test('A logged in user tries to update a permanent post with only text',
    ({}) => {

    }
  );
  test('A logged in user tries to update a permanent post with only multimedia content',
    ({}) => {

    }
  );
  test('A logged in user tries to update a permanent post that does not exist',
    ({}) => {

    }
  );
});
