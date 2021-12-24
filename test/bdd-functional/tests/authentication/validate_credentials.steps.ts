import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { ValidateCredentialsService } from '@core/service/user/validate_credentials.service';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import ValidateCredentialsOutputModel from '@core/domain/user/use-case/output-model/validate_credentials.output_model';
import {
  UserAccountException,
  UserAccountInvalidCredentialsException,
  UserAccountNotFoundException
} from '@core/domain/user/use-case/exception/user_account.exception';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature(
  'test/bdd-functional/features/authentication/validate_credentials.feature',
);

defineFeature(feature, (test) => {
  let email: string;
  let password: string;

  let create_user_account_interactor: CreateUserAccountService;
  let validate_credentials_service: ValidateCredentialsService;
  let output: ValidateCredentialsOutputModel;
  let exception: UserAccountException;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenUserProvidesCredentials(given) {
    given(
      /^a user provides the credentials: "([^"]*)" and "([^"]*)"$/,
      (provided_email: string, provided_password: string) => {
        email = provided_email;
        password = provided_password;
      },
    );
  }

  function andAccountExists(and) {
    and(
      /^an account exist with credentials: "([^"]*)" and "([^"]*)"$/,
      async (email, password) => {
        await createUserAccount(createUserMock(email, password));
      },
    );
  }

  function whenUserTriesToValidateTheirCredentials(when) {
    when('the user tries to validate their credentials', async () => {
      try {
        output = await validate_credentials_service.execute({
          email,
          password,
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountService>(UserDITokens.CreateUserAccountInteractor);
    validate_credentials_service = module.get<ValidateCredentialsService>(UserDITokens.ValidateCredentialsInteractor);
    exception = undefined;
  });

  test('A user that has an account validates their credentials in successfully',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andAccountExists(and);
      whenUserTriesToValidateTheirCredentials(when);
      then('the user gets the id of their account', () => {
        expect(output).toBeDefined();
        expect(output.id).toBeDefined();
      });
    }
  );

  test('A user that has an account cannot validate their credentials due to invalid ones',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andAccountExists(and);
      whenUserTriesToValidateTheirCredentials(when);
      then(
        'an error occurs: the credentials provided by the user are not valid',
        () => {
          expect(exception).toBeInstanceOf(UserAccountInvalidCredentialsException);
        },
      );
    }
  );

  test('A user tries to validate credentials of an account that does not exist',
    ({ given, when, then }) => {
      givenUserProvidesCredentials(given);
      whenUserTriesToValidateTheirCredentials(when);
      then(
        'an error occurs: the email provided by the user does not match an account',
        () => {
          expect(exception).toBeInstanceOf(
            UserAccountNotFoundException,
          );
        },
      );
    }
  );
});
