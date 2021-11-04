import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature('bdd-functional/features/user/create_user_account.feature');

defineFeature(feature, (test) => {
  test('Create user account', ({ given, and, when, then }) => {
    let email: string;
    let password: string;

    let exception: CreateUserAccountException;

    let createUserAccountService: CreateUserAccountService;
    let output: CreateUserAccountOutputModel;

    function createUserAccount(email: string, password: string) {
      try {
        createUserAccountService.execute(new CreateUserAccountInputModel(email, password));
      } catch (e: CreateUserAccountException) {
        exception = e;
      }
    }

    given(/^the user provides the credentials: email being "([^"]*)" and password being "([^"]*)"$/,
      (input_email: string, input_password: string) => {
        email = input_email;
        password = input_password;
      });

    const givenAccountAlreadyExistsRegularExpression = new RegExp(
      [
        '^there already exists an account identified by the email "([^"]*)" ',
        'and the user provides the email with the password "<Password>"$'
      ].join('')
    );

    given(givenAccountAlreadyExistsRegularExpression, (input_email, input_password) => {
      email = input_email;
      password = input_password;
      createUserAccount(email, password);
    });

    when('the user tries to create an account', () => {
      createUserAccount(email, password);
    });

    then('an account is then created with user information and login credentials', () => {
      const expectedOutput = new CreateUserAccountOutputModel( email );
      expect( output.email ).toEqual( expectedOutput.email );
    });

    then('an error occurs: the credentials provided by the user are in an invalid format', () => {
      expect(typeof exception === CreateAccountInvalidCredentialsFormatException).toBeTruthy();
    });

    then('an error occurs: an account with the email provided by the user already exists', () => {
      expect(typeof exception === CreateUserAccountAlreadyExistsException).toBeTruthy();
    });
  });
});
