import { loadFeature, defineFeature } from 'jest-cucumber';

const feature = loadFeature('bdd-functional/features/user/create_user_account.feature');

defineFeature(feature, (test) => {
  test('Create user account', ({ given, and, when, then }) => {
    let email: string;
    let password: string;
    let name: string;
    let date_of_birth;

    let exception: CreateUserAccountException;

    let createUserAccountService: CreateUserAccountService;
    let output: CreateUserAccountOutputModel;

    function createUserAccount(input: CreateUserAccountInputModel) {
      try {
        output = createUserAccountService.execute(input);
      } catch (e: CreateUserAccountException) {
        exception = e;
      }
    }

    given(/^the user provides the credentials: "([^"]*)" and "([^"]*)"$/,
      (input_email: string, input_password: string) => {
        email = input_email;
        password = input_password;
      });

    and(/the data of the account to create: "([^"]*)", "([^"]*)"/, (input_name, input_date_of_birth) => {
      name = input_name;
      date_of_birth = input_date_of_birth;
    });

    and('there already exists an account identified by the email provided by the user', () => {
      createUserAccount({
        email,
        password,
        name,
        date_of_birth
      });
    });

    when('the user tries to create an account', () => {
      createUserAccount({
        email,
        password,
        name,
        date_of_birth
      });
    });

    then('an account is then created with user information and login credentials', () => {
      const expectedOutput = new CreateUserAccountOutputModel( email );
      expect( output.email ).toEqual( expectedOutput.email );
    });

    then('an error occurs: the credentials and data provided by the user are in an invalid format', () => {
      expect(typeof exception === CreateAccountInvalidDataFormatException).toBeTruthy();
    });

    then('an error occurs: an account with the email provided by the user already exists', () => {
      expect(typeof exception === CreateUserAccountAlreadyExistsException).toBeTruthy();
    });
  });
});
