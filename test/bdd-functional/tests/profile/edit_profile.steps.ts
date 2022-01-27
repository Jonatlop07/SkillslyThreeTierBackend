import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ProfileDITokens } from '@core/domain/profile/di/profile_di_tokens';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateProfileOutputModel from '@core/domain/profile/use-case/output-model/create_profile.output_model';
import { CreateProfileInteractor } from '@core/domain/profile/use-case/interactor/create_profile.interactor';
import { EditProfileInteractor } from '@core/domain/profile/use-case/interactor/edit_profile.interactor';
import {
  ProfileEditEmptyInputException,
  ProfileException,
} from '@core/domain/profile/use-case/exception/profile.exception';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/profile/edit_profile.feature');

defineFeature(feature, (test) => {

  const user_mock1: CreateUserAccountInputModel = createUserMock();
  const user_mock2: CreateUserAccountInputModel = createUserMock('newuser_1234@test.com');
  const user_mock3: CreateUserAccountInputModel = createUserMock('newuser_12344@test.com');
  const user_mock4: CreateUserAccountInputModel = createUserMock('newuser_12345@test.com');
  const user_mock5: CreateUserAccountInputModel = createUserMock('newuser_12347@test.com');
  const user_mock6: CreateUserAccountInputModel = createUserMock('newuser_124@test.com');
  const user_mock7: CreateUserAccountInputModel = createUserMock('newuse_1234@test.com');

  let user_id: string;
  let profile_new_content: Partial<ProfileDTO>;
  let output: CreateProfileOutputModel;
  let exception: ProfileException;

  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_profile_interactor: CreateProfileInteractor;
  let edit_profile_interactor: EditProfileInteractor;

  const createUserAccount = async (input: CreateUserAccountInputModel) => {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
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
        user_id,
      });
    });
  };

  const andUserProvidesTheNewContentOfUserProfile = (and) => {
    and('user provides the new content of the user profile :', (new_profile_content_table) => {
      profile_new_content = {};
      Object.keys(new_profile_content_table[0]).forEach(key => {
        if (new_profile_content_table[0][key] !== '') {
          profile_new_content[key] = new_profile_content_table[0][key];
        }
      });
      if (Object.keys(profile_new_content).length !== 0) {
        profile_new_content.user_id = user_id;
      }
    });
  };

  const whenUserTriesToUpdateHisProfile = (when) => {
    when('user tries to update his profile', async () => {
      try {
        output = await edit_profile_interactor.execute(profile_new_content);
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

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    create_profile_interactor = module.get<CreateProfileInteractor>(ProfileDITokens.CreateProfileInteractor);
    edit_profile_interactor = module.get<EditProfileInteractor>(ProfileDITokens.EditProfileInteractor);
    exception = undefined;
  });

  test('An user tries to edit his user profile', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock1);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile without any content', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock2);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    then('an error occurs: content should not be empty', () => {
      expect(exception).toBeInstanceOf(ProfileEditEmptyInputException);
    });
  });

  test('An user tries to edit his user profile changing only the resume', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock3);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the knowledge', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock4);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the talents', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock5);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the activities', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock6);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });

  test('An user tries to edit his user profile changing only the interests', ({ given, and, when, then }) => {
    givenAnExistingUser(given, user_mock7);
    andThereExistsAProfileBelongsToUser(and);
    andUserProvidesTheNewContentOfUserProfile(and);
    whenUserTriesToUpdateHisProfile(when);
    thenProfileIsUpdatedWithNewProvidedContent(then);
  });
});
