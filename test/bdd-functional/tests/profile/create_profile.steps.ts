import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import {
  CreateProfileException, CreateProfileInvalidDataFormatException,

} from '@core/service/profile/create_profile.exception';
import CreateProfileInputModel from '@core/domain/profile/input-model/create_profile.input_model';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileInMemoryRepository } from '@infrastructure/persistence/profile_in_memory.repository';

const feature = loadFeature('test/bdd-functional/features/profile/create_profile.feature');

defineFeature(feature, (test) => {
  let resume: string;
  let knowledge: Array<string>;
  let talents: Array<string>;
  let activities: Array<string>;
  let interests: Array<string>;
  let userID: number;

  let createProfileService: CreateProfileService;
  let output: CreateProfileOutputModel;
  let exception: CreateProfileException = undefined;


  const createProfileAccount = async (input: CreateProfileInputModel) => {
    try {
      output = await createProfileService.execute(input);
    } catch (e) {
      exception = e;
    }
  };

  const givenUserProvidesProfileData = (given) => {
    given(/^the user provides the data: "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)", "([^"]*)" and "([^"]*)"$/,
      (inputResume, inputKnowledge, inputTalents, inputActivities, inputInterests, inputUserID) => {
        resume = inputResume;
        knowledge = inputKnowledge.split(',');
        talents = inputTalents.split(',');
        activities = inputActivities.split(',');
        interests = inputInterests.split(',');
        userID = inputUserID;
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
          userID,
        },
      );
    });
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    createProfileService = module.get<CreateProfileService>(ProfileDITokens.CreateProfileInteractor);
  });


  beforeEach(() => {
    // exception = undefined;
  });

  test('A user tries to create an user profile with data in a valid format', ({ given, when, then }) => {
    givenUserProvidesProfileData(given);
    whenUserTriesToCreateAnUserProfile(when);
    then('the profile is created with the data provided', () => {
      const expectedOutput: CreateProfileOutputModel = {
        resume,
        knowledge,
        talents,
        activities,
        interests,
      };
      expect(output).toBeDefined();
      expect(output).toEqual(expectedOutput);
    });
  });

  test('A user tries to create an user profile with data in an invalid format', ({ given, when, then }) => {
    givenUserProvidesProfileData(given);
    whenUserTriesToCreateAnUserProfile(when);
    then('an error occurs: provided profile information are in an invalid format', () => {
      expect(exception).toBeInstanceOf(CreateProfileInvalidDataFormatException);
    });
  });

});
