import { loadFeature, defineFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import {
  UserAccountAlreadyExistsException,
  UserAccountException,
  UserAccountInvalidDataFormatException
} from '@core/domain/user/use-case/exception/user_account.exception';

const feature = loadFeature('test/bdd-functional/features/user/create_user_account.feature');

defineFeature(feature, (test) => {
  let email: string;
  let password: string;
  let name: string;
  let date_of_birth;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let output: CreateUserAccountOutputModel;
  let exception: UserAccountException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      output = await create_user_account_interactor.execute(input);
    } catch (e) {
      exception = e;
    }
  }

  function givenUserProvidesCredentials(given) {
    given(
      /^the user provides the credentials: "([^"]*)" and "([^"]*)"$/,
      (input_email: string, input_password: string) => {
        email = input_email;
        password = input_password;
      },
    );
  }

  function andUserProvidesDataOfAccount(and) {
    and(
      /^the data of the account to create: "([^"]*)", "([^"]*)"$/,
      (input_name, input_date_of_birth) => {
        name = input_name;
        date_of_birth = input_date_of_birth;
      },
    );
  }

  function whenUserTriesToCreateAccount(when) {
    when('the user tries to create an account', async () => {
      await createUserAccount({
        email,
        password,
        name,
        date_of_birth,
        is_investor: false,
        is_requester: false
      });
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    exception = undefined;
  });

  test('A user tries to create an account with credentials and account data in a valid format',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andUserProvidesDataOfAccount(and);
      whenUserTriesToCreateAccount(when);
      then(
        'an account is then created with user information and login credentials: id and email are returned',
        () => {
          const expected_output: CreateUserAccountOutputModel = {
            id: '1',
            email,
          };
          expect(output).toBeDefined();
          expect(output.id).toEqual(expected_output.id);
          expect(output.email).toEqual(expected_output.email);
        },
      );
    }
  );

  test('A user attempts to create an account with the credentials and data in an invalid format',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andUserProvidesDataOfAccount(and);
      whenUserTriesToCreateAccount(when);
      then(
        'an error occurs: the credentials and data provided by the user are in an invalid format',
        () => {
          expect(exception).toBeInstanceOf(UserAccountInvalidDataFormatException);
        },
      );
    }
  );

  test('A user fails to create an account because there already exists an account with the email provided',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andUserProvidesDataOfAccount(and);
      and(
        'there already exists an account identified by the email provided by the user',
        async () => {
          await createUserAccount({
            email,
            password,
            name,
            date_of_birth,
            is_investor: false,
            is_requester: false
          });
        },
      );
      whenUserTriesToCreateAccount(when);
      then(
        'an error occurs: an account with the email provided by the user already exists',
        () => {
          expect(exception).toBeInstanceOf(UserAccountAlreadyExistsException);
        },
      );
    }
  );
});
