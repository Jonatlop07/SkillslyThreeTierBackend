import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/input-model/create_user_account.input_model';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateUserAccountService } from '@core/service/user/create_user_account.service';
import { UserInMemoryRepository } from '@infrastructure/adapter/persistence/user_in_memory.repository';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CreateProfileService } from '@core/service/profile/create_profile.service';
import { ProfileInMemoryRepository } from '@infrastructure/adapter/persistence/profile_in_memory.repository';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/create_user_account.interactor';
import { EditProfileService } from '@core/service/profile/edit_profile.service';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { GetProfileService } from '@core/service/profile/get_profile.service';
import { EditInputEmptyException, EditProfileException } from '@core/service/profile/edit_profile.exception';

const feature = loadFeature('test/bdd-functional/features/profile/edit_profile.feature');

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
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };
  const userMock3: CreateUserAccountInputModel = {
    email: 'newuser_12344@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };
  const userMock4: CreateUserAccountInputModel = {
    email: 'newuser_12345@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };
  const userMock5: CreateUserAccountInputModel = {
    email: 'newuser_12347@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };
  const userMock6: CreateUserAccountInputModel = {
    email: 'newuser_124@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };
  const userMock7: CreateUserAccountInputModel = {
    email: 'newuse_1234@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
  };

  let userEmail: string;
  let profileNewContent: Partial<ProfileDTO>;
  let output: CreateProfileOutputModel;
  let exception: EditProfileException;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createProfileService: CreateProfileService;
  let editProfileService: EditProfileService;

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

  const andUserProvidesTheNewContentOfUserProfile = (and) => {
    and('user provides the new content of the user profile :', (newProfileContentTable) => {
      profileNewContent = {};
      Object.keys(newProfileContentTable[0]).forEach(key => {
        if (newProfileContentTable[0][key] !== '') {
          profileNewContent[key] = newProfileContentTable[0][key];
        }
      });
      if (Object.keys(profileNewContent).length !== 0) {
        profileNewContent.userEmail = userEmail;
      }
    });
  };

  const whenUserTriesToUpdateHisProfile = (when) => {
    when('user tries to update his profile', async () => {
      try {
        output = await editProfileService.execute(profileNewContent);
      } catch (e) {
        exception = e;
      }
    });
  };

  const thenProfileIsUpdatedWithNewProvidedContent = (then) => {
    then('the profile is updated with new provided content', () => {
      expect(output).toBeDefined();
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
        {
          provide: ProfileDITokens.EditProfileInteractor,
          useFactory: (gateway, getProfileInteractor) => new EditProfileService(gateway, getProfileInteractor),
          inject: [ProfileDITokens.ProfileRepository, ProfileDITokens.GetProfileInteractor],
        },
      ],
    }).compile();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    createProfileService = module.get<CreateProfileService>(ProfileDITokens.CreateProfileInteractor);
    editProfileService = module.get<EditProfileService>(ProfileDITokens.EditProfileInteractor);
  });

  beforeEach(() => {
    exception = undefined;
  });

  test('An user tries to edit his user profile', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock1);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile without any content', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock2);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    then('an error occurs: content should not be empty', () => {
      expect(exception).toBeInstanceOf(EditInputEmptyException);
    });
  });

  test('An user tries to edit his user profile changing only the resume', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock3);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the knowledge', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock4);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the talents', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock5);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the activities', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock6);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the interests', ({ given, and, when, then }) => {
    givenAnExistingUser(given, userMock7);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

})
;