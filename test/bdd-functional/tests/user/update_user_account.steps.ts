import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';
import { UpdateUserAccountInteractor } from '@core/domain/user/use-case/update_user_account.interactor';
import UpdateUserAccountOutputModel from '@core/domain/user/use-case/output-model/update_user_account.output_model';
import { UpdateUserAccountService } from '@core/service/user/update_user_account.service';
import { UserAccountInvalidDataFormatException } from '@core/service/user/user_account.exception';

const feature = loadFeature('test/bdd-functional/features/user/update_user_account.feature');

class UserAccountException {
}

defineFeature(feature, (test) => {
  const user_mock: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000'
  };

  let user_id: string;
  let email: string;
  let password: string;
  let name: string;
  let date_of_birth: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let update_user_account_interactor: UpdateUserAccountInteractor;
  let output: UpdateUserAccountOutputModel;
  let exception: UserAccountException;

  function givenAUserExists(given) {
    given(/^a user exists, is logged in, and has an id of "([^"]*)"$/,
      async (id: string) => {
        user_id = id;
        try {
          await create_user_account_interactor.execute(user_mock);
        } catch (e) {
          console.log(e);
        }
      }
    );
  }

  function andUserProvidesAccountDataToBeUpdated(and) {
    and(/^the user provides the data to be updated: "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)"$/,
      (
        provided_email: string,
        provided_password: string,
        provided_name: string,
        provided_date_of_birth: string
      ) => {
        email = provided_email;
        password = provided_password;
        name = provided_name;
        date_of_birth = provided_date_of_birth;
      }
    );
  }

  function whenTheUserTriesToUpdateTheirAccount(when) {
    when('the user tries to update their account', async () => {
      try {
        output = await update_user_account_interactor.execute({
          id: user_id,
          email,
          password,
          name,
          date_of_birth
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserAccountInteractor,
          useFactory: (gateway) => new CreateUserAccountService(gateway),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UpdateUserAccountInteractor,
          useFactory: (gateway) => new UpdateUserAccountService(gateway),
          inject: [UserDITokens.UserRepository]
        },
        {
          provide: UserDITokens.UserRepository,
          useFactory: () => new UserInMemoryRepository(new Map())
        }
      ]
    }).compile();

    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    update_user_account_interactor = module.get<UpdateUserAccountInteractor>(UserDITokens.UpdateUserAccountInteractor);
    exception = undefined;
  });

  test('A logged in user tries to update their account with credentials or account data in a valid format',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesAccountDataToBeUpdated(and);
      whenTheUserTriesToUpdateTheirAccount(when);
      then('the account data is successfully updated', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in user attempts to update their account with credentials or data in an invalid format',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesAccountDataToBeUpdated(and);
      whenTheUserTriesToUpdateTheirAccount(when);
      then('an error occurs: the credentials or data provided by the user are in an invalid format',
        () => {
          expect(exception).toBeInstanceOf(UserAccountInvalidDataFormatException);
        }
      );
    }
  );
});
