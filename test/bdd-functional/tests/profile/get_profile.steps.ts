import { defineFeature, loadFeature } from 'jest-cucumber';
import { GetProfileService } from '@core/service/profile/get_profile.service';
import GetProfileOutputModel from '@core/domain/profile/use-case/output-model/get_profile.output_model';
import GetProfileInputModel from '@core/domain/profile/input-model/get_profile.input_model';

const feature = loadFeature('test/bdd-functional/features/profile/get_profile.feature');

defineFeature(feature, (test) => {
  let userID: number;

  let getProfileService: GetProfileService;
  let output: GetProfileOutputModel;
  // let exception: GetProfileException = undefined;

  const getUserProfile = async (input: GetProfileInputModel) => {
    try {
      output = await getProfileService.execute(input);
    } catch (e) {
      // exception = e;
    }
  };

  const whenUsertTriesToGetAnUserProfile = (when) => {
    when('user tries to get an user profile', async () => {
      await getUserProfile({
        userID,
      });
    });
  };

  test('A user tries to get an user profile', ({ given, when, then }) => {
    given(/^the user id (.*) is provided in a valid format$/, (inputUserID: number) => {
      userID = inputUserID;
    });
    whenUsertTriesToGetAnUserProfile(when);
    then('the user profile is obtained', () => {
      expect(output).toBeDefined();
    });

  });


});