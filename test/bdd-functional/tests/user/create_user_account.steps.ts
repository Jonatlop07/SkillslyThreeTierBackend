import { loadFeature, defineFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import CreateUserAccountOutputModel from '@core/domain/user/use-case/output-model/create_user_account.output_model';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import {
  CreateUserAccountException,
  CreateUserAccountInvalidDataFormatException,
  CreateUserAccountAlreadyExistsException
} from '@core/service/user/create_user_account.exception';
import { UserInMemoryRepository } from '@infrastructure/persistence/user_in_memory.repository';

const feature = loadFeature('test/bdd-functional/features/user/create_user_account.feature');

defineFeature(feature, (test) => {
  let email: string;
  let password: string;
  let name: string;
  let date_of_birth;

  const createUserAccountService = new CreateUserAccountService(new UserInMemoryRepository(new Map()));
  let output: CreateUserAccountOutputModel;
  let exception: CreateUserAccountException = undefined;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      output = await createUserAccountService.execute(input);
    } catch (e) {
      exception = e;
    }
  }

  function givenUserProvidesCredentials(given) {
    given(/^the user provides the credentials: "([^"]*)" and "([^"]*)"$/,
      (input_email: string, input_password: string) => {
        email = input_email;
        password = input_password;
      });
  }

  function andUserProvidesDataOfAccount(and) {
    and(/the data of the account to create: "([^"]*)", "([^"]*)"/, (input_name, input_date_of_birth) => {
      name = input_name;
      date_of_birth = input_date_of_birth;
    });
  }

  function whenUserTriesToCreateAccount(when) {
    when('the user tries to create an account', async () => {
      await createUserAccount({
        email,
        password,
        name,
        date_of_birth
      });
    });
  }

  beforeEach(() => {
    exception = undefined;
  });

  test('A user tries to create an account with credentials and account data in a valid format',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andUserProvidesDataOfAccount(and);
      whenUserTriesToCreateAccount(when);

      then('an account is then created with user information and login credentials', () => {
        const expectedOutput: CreateUserAccountOutputModel = { email };
        expect(output).toBeDefined();
        expect( output.email ).toEqual( expectedOutput.email );
      });
    });

  test('A user attempts to create an account with the credentials and data in an invalid format',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andUserProvidesDataOfAccount(and);
      whenUserTriesToCreateAccount(when);

      then('an error occurs: the credentials and data provided by the user are in an invalid format', () => {
        expect(exception).toBeInstanceOf(CreateUserAccountInvalidDataFormatException);
      });
    });

  test('A user fails to create an account because there already exists an account with the email provided',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andUserProvidesDataOfAccount(and);

      and('there already exists an account identified by the email provided by the user', async () => {
        await createUserAccount({
          email,
          password,
          name,
          date_of_birth
        });
      });

      whenUserTriesToCreateAccount(when);

      then('an error occurs: an account with the email provided by the user already exists', () => {
        expect(exception).toBeInstanceOf(CreateUserAccountAlreadyExistsException);
      });
    });
});
