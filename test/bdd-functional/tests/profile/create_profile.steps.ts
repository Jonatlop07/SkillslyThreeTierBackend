import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import {
  CreateProfileException,
  CreateProfileInvalidDataFormatException,
} from '@core/service/profile/create_profile.exception';
import CreateProfileInputModel from '@core/domain/profile/input-model/create_profile.input_model';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileInMemoryRepository } from '@infrastructure/adapter/persistence/profile_in_memory.repository';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';

const feature = loadFeature('test/bdd-functional/features/profile/create_profile.feature');

defineFeature(feature, (test) => {

  const userMock1: CreateUserAccountInputModel = {
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
  let userEmail: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createProfileService: CreateProfileService;
  let output: CreateProfileOutputModel;
  let exception: CreateProfileException = undefined;

  const createUserAccount = async (input: CreateUserAccountInputModel) => {
    try {
      const { email } = await createUserAccountInteractor.execute(input);
      userEmail = email;
    } catch (e) {
      // console.log(e);
    }
  };

  const createProfileAccount = async (input: CreateProfileInputModel) => {
    try {
      output = await createProfileService.execute(input);
    } catch (e) {
      exception = e;
    }
  };

  const givenUserProvidesProfileData = (given) => {
    given('a existing user', async () => {
      await createUserAccount(userMock1);
    });
  };

  const andUserProvidesProfileData = (and) => {
    and(/^the user provides profile data: "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" and "([^"]*)"$/,
      (inputResume, inputKnowledge, inputTalents, inputActivities, inputInterests) => {
        resume = inputResume;
        knowledge = inputKnowledge.split(',');
        talents = inputTalents.split(',');
        activities = inputActivities.split(',');
        interests = inputInterests.split(',');
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
          userEmail,
        },
      );
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserDITokens.CreateUserAccountInteractor,
          useFactory: (gateway) => new CreateUserAccountService(gateway),
          inject: [UserDITokens.UserRepository],
        },
        {
          provide: UserDITokens.UserRepository,
          useFactory: () => new UserInMemoryRepository(new Map()),
        },
        {
          provide: ProfileDITokens.CreateProfileInteractor,
          useFactory: (gateway) => new CreateProfileService(gateway),
          inject: [ProfileDITokens.ProfileRepository],
        },
        {
          provide: ProfileDITokens.ProfileRepository,
          useFactory: () => new ProfileInMemoryRepository(new Map()),
        },
      ],
    }).compile();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    createProfileService = module.get<CreateProfileService>(ProfileDITokens.CreateProfileInteractor);
  });


  beforeEach(() => {
    exception = undefined;
  });

  test('A user tries to create an user profile with data in a valid format', ({ given, and, when, then }) => {
    givenUserProvidesProfileData(given);
    andUserProvidesProfileData(and);
    whenUserTriesToCreateAnUserProfile(when);
    then('the profile is created with the data provided', () => {
      const expectedOutput: CreateProfileOutputModel = {
        resume,
        knowledge,
        talents,
        activities,
        interests,
        userEmail,
      };
      expect(output).toBeDefined();
      expect(output).toEqual(expectedOutput);
    });
  });


  test('A user tries to create an user profile with data in an invalid format', ({ given, and, when, then }) => {
    givenUserProvidesProfileData(given);
    andUserProvidesProfileData(and);
    whenUserTriesToCreateAnUserProfile(when);
    then('an error occurs: provided profile information are in an invalid format', () => {
      expect(exception).toBeInstanceOf(CreateProfileInvalidDataFormatException);
    });
  });

});
