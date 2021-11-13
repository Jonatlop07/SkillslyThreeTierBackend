import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { GetProfileInteractor } from '@core/domain/profile/use-case/interactor/get_profile.interactor';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/interactor/create_profile.interactor';
import { ProfileException, ProfileNotFoundException } from '@core/domain/profile/use-case/exception/profile.exception';

const feature = loadFeature('test/bdd-functional/features/profile/get_profile.feature');

defineFeature(feature, (test) => {
  const user_mock_1: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  const user_mock_2: CreateUserAccountInputModel = {
    email: 'newuser_1234@test.com',
    password: 'Abc123_tr',
    name: 'Pedro',
    date_of_birth: '01/01/2000',
  };

  let user_email: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_profile_interactor: CreateProfileInteractor;
  let get_profile_interactor: GetProfileInteractor;

  let output: GetProfileOutputModel;
  let exception: ProfileException;

  const createUserAccount = async (input: CreateUserAccountInputModel) => {
    try {
      const { email } = await create_user_account_interactor.execute(input);
      user_email = email;
    } catch (e) {
      console.log(e);
    }
  };

  const givenAnExistingUser = (given, mock) => {
    given('an existing user', async () => {
      await createUserAccount(mock);
    });
  };

  const andThereExistsAProfileBelongsToUser = (and) => {
    and('there exists a profile belongs to that user, with content:', async (profile_content_table) => {
      await create_profile_interactor.execute({
        resume: profile_content_table[0]['resume'],
        knowledge: profile_content_table[0]['knowledge'].split(','),
        interests: profile_content_table[0]['interests'].split(','),
        talents: profile_content_table[0]['talents'].split(','),
        activities: profile_content_table[0]['activities'].split(','),
        user_email,
      });
    });
  };

  const whenUserTriesToGetAnUserProfile = (when) => {
    when('user tries to get user profile', async () => {
      try {
        output = await get_profile_interactor.execute({
          user_email,
        });
      } catch (e) {
        exception = e;
      }
    });
  };

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_profile_interactor = module.get<CreateProfileInteractor>(ProfileDITokens.CreateProfileInteractor);
    get_profile_interactor = module.get<GetProfileInteractor>(ProfileDITokens.GetProfileInteractor);
    exception = undefined;
  });

  test('An user tries to get an user profile', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock_1);
    andThereExistsAProfileBelongsToUser(and);
    whenUserTriesToGetAnUserProfile(when);
    then('the user profile is obtained', () => {
      expect(output).toBeDefined();
    });
  });

  test('An user tries to get an user profile that doesn\'t exist', ({ given, when, then }) => {
    givenAnExistingUser(given, user_mock_2);
    whenUserTriesToGetAnUserProfile(when);
    then('an error occurs: there\'s no profile associated to the user', () => {
      expect(exception).toBeInstanceOf(ProfileNotFoundException);
    });
  });
});
