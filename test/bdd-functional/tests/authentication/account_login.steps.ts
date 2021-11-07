import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';

const feature = loadFeature('test/bdd-functional/features/authentication/account_login.feature');

defineFeature(feature, (test) => {
  let email: string;
  let password: string;

  let create_user_account_service: CreateUserAccountService;
  let authentication_service: AuthenticationService;
  let output: LogIntoAccountOutputModel;
  let exception: LogIntoAccountException;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_service.execute(input);
    } catch (e) {
      console.log(exception);
    }
  }

  function givenUserProvidesCredentials(given) {
    given(/^a user provides the credentials: "([^"]*)" and "([^"]*)"$/,
      (provided_email: string, provided_password: string) => {
        email = provided_email;
        password = provided_password;
      }
    );
  }

  function andAccountExists(and) {
    and(/^an account exist with credentials: "([^"]*)" and "([^"]*)"$/,
      async (email, password) => {
        await createUserAccount({
          email,
          password,
          name: 'User',
          date_of_birth: '01/01/2000'
        });
      }
    );
  }

  function whenUserTriesToLogIntoAccount(when) {
    when('the user tries to log into the account', async () => {
      try {
        output = await authentication_service.login({
          email,
          password,
        });
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeAll(async () => {
    const user_module: TestingModule = await Test.createTestingModule({
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
      ]
    }).compile();
    const authentication_module: TestingModule = await Test.createTestingModule({
      providers: []
    }).compile();

    create_user_account_service = user_module.get<CreateUserAccountService>(UserDITokens.CreateUserAccountInteractor);
    authentication_service = authentication_module.get<AuthenticationService>(AuthenticationDITokens.AuthenticationProvider);
  });

  beforeEach(() => {
    exception = undefined;
  });

  test('A user that has an account logs in successfully',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andAccountExists(and);
      whenUserTriesToLogIntoAccount(when);

      then('the user receives a token that autenticates them', () => {
        expect(output).toBeDefined();
        expect(output.user).toBeDefined();
      });
    }
  );

  test('A user has an account and tries to log in with invalid credentials',
    ({ given, and, when, then }) => {
      givenUserProvidesCredentials(given);
      andAccountExists(and);
      whenUserTriesToLogIntoAccount(when);

      then('an error occurs: the credentials provided by the user are not valid', () => {
        expect(exception).toBeInstanceOf(LogIntoAccountInvalidCredentialsException);
      });
    }
  );

  test('A user tries log in to an account that does not exist',
    ({ given, when, then }) => {
      givenUserProvidesCredentials(given);
      whenUserTriesToLogIntoAccount(when);

      then('an error occurs: the email provided by the user does not match an account', () => {
        expect(exception).toBeInstanceOf(LogIntoAccountNonExistentException);
      });
    }
  );
});
