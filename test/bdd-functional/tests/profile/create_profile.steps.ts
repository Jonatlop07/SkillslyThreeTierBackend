import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import CreateProfileInputModel from '@core/domain/profile/use-case/input-model/create_profile.input_model';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/interactor/create_profile.interactor';
import {
  ProfileException,
  ProfileInvalidDataFormatException
} from '@core/domain/profile/use-case/exception/profile.exception';

const feature = loadFeature('test/bdd-functional/features/profile/create_profile.feature');

defineFeature(feature, (test) => {
  const user_mock_1: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  let resume: string;
  let knowledge: Array<string>;
  let talents: Array<string>;
  let activities: Array<string>;
  let interests: Array<string>;
  let user_email: string;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_profile_interactor: CreateProfileInteractor;
  let output: CreateProfileOutputModel;
  let exception: ProfileException = undefined;

  const createUserAccount = async (input: CreateUserAccountInputModel) => {
    try {
      const { email } = await create_user_account_interactor.execute(input);
      user_email = email;
    } catch (e) {
      // console.log(e);
    }
  };

  const createProfileAccount = async (input: CreateProfileInputModel) => {
    try {
      output = await create_profile_interactor.execute(input);
    } catch (e) {
      exception = e;
    }
  };

  const givenUserProvidesProfileData = (given) => {
    given('a existing user', async () => {
      await createUserAccount(user_mock_1);
    });
  };

  const andUserProvidesProfileData = (and) => {
    and(/^the user provides profile data: "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" and "([^"]*)"$/,
      (input_resume, input_knowledge, input_talents, input_activities, input_interests) => {
        resume = input_resume;
        knowledge = input_knowledge.split(',');
        talents = input_talents.split(',');
        activities = input_activities.split(',');
        interests = input_interests.split(',');
      });
  };

  const whenUserTriesToCreateAnUserProfile = (when) => {
    when('user tries to create an user profile', async () => {
      await createProfileAccount(
        {
          resume,
          knowledge,
          talents,
          activities,
          interests,
          user_email,
        },
      );
    });
  };

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_profile_interactor = module.get<CreateProfileService>(ProfileDITokens.CreateProfileInteractor);
    exception = undefined;
  });

  test('A user tries to create an user profile with data in a valid format', ({ given, and, when, then }) => {
    givenUserProvidesProfileData(given);
    andUserProvidesProfileData(and);
    whenUserTriesToCreateAnUserProfile(when);
    then('the profile is created with the data provided', () => {
      const expected_output: CreateProfileOutputModel = {
        resume,
        knowledge,
        talents,
        activities,
        interests,
        user_email,
      };
      expect(output).toBeDefined();
      expect(output).toEqual(expected_output);
    });
  });

  test('A user tries to create an user profile with data in an invalid format', ({ given, and, when, then }) => {
    givenUserProvidesProfileData(given);
    andUserProvidesProfileData(and);
    whenUserTriesToCreateAnUserProfile(when);
    then('an error occurs: provided profile information are in an invalid format', () => {
      expect(exception).toBeInstanceOf(ProfileInvalidDataFormatException);
    });
  });
});
