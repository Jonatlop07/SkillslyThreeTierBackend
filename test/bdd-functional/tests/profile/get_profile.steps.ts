import { defineFeature, loadFeature } from 'jest-cucumber';
import { GetProfileService } from '@core/service/profile/get_profile.service';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { ProfileInMemoryRepository } from '@infrastructure/adapter/persistence/profile_in_memory.repository';
import { GetProfileException, GetProfileNotFoundFormatException } from '@core/service/profile/get_profile.exception';

const feature = loadFeature('test/bdd-functional/features/profile/get_profile.feature');

defineFeature(feature, (test) => {
  const userMock1: CreateUserAccountInputModel = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  const userMock2: CreateUserAccountInputModel = {
    email: 'newuser_1234@test.com',
    password: 'Abc123_tr',
    name: 'Pedro',
    date_of_birth: '01/01/2000',
  };

  let userEmail: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createProfileService: CreateProfileService;
  let getProfileService: GetProfileService;

  let output: GetProfileOutputModel;
  let exception: GetProfileException = undefined;


  const createUserAccount = async (input: CreateUserAccountInputModel) => {
    try {
      const { email } = await createUserAccountInteractor.execute(input);
      userEmail = email;
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
    and('there exists a profile belongs to that user, with content:', async (profileContentTable) => {

      await createProfileService.execute({
        resume: profileContentTable[0]['resume'],
        knowledge: profileContentTable[0]['knowledge'].split(','),
        interests: profileContentTable[0]['interests'].split(','),
        talents: profileContentTable[0]['talents'].split(','),
        activities: profileContentTable[0]['activities'].split(','),
        userEmail: userEmail,
      });
    });
  };


  const whenUserTriesToGetAnUserProfile = (when) => {
    when('user tries to get user profile', async () => {
      try {
        output = await getProfileService.execute({
          userEmail: userEmail,
        });
      } catch (e) {
        exception = e;
      }
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
        {
          provide: ProfileDITokens.GetProfileInteractor,
          useFactory: (gateway) => new GetProfileService(gateway),
          inject: [ProfileDITokens.ProfileRepository],
        },
      ],
    }).compile();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    createProfileService = module.get<CreateProfileService>(ProfileDITokens.CreateProfileInteractor);
    getProfileService = module.get<GetProfileService>(ProfileDITokens.GetProfileInteractor);
  });


  beforeEach(() => {
    exception = undefined;
  });

  test('An user tries to get an user profile', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock1);
    andThereExistsAProfileBelongsToUser(and);
    whenUserTriesToGetAnUserProfile(when);
    then('the user profile is obtained', () => {
      expect(output).toBeDefined();
    });
  });

  test('An user tries to get an user profile that doesn\'t exist', ({ given, when, then }) => {
    givenAnExistingUser(given, userMock2);
    whenUserTriesToGetAnUserProfile(when);
    then('an error occurs: there\'s no profile asociated to the user', () => {
      // expect(output).toBeUndefined();
      expect(exception).toBeInstanceOf(GetProfileNotFoundFormatException);
    });
  });


});