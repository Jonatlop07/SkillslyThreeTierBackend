import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateTemporalPostOutputModel
  from '@core/domain/temporal-post/use-case/output-model/create_temporal_post.output_model';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateTemporalPostInputModel from '@core/domain/temporal-post/use-case/input-model/create_temporal_post.input_model';
import { CreateTemporalPostInteractor } from '@core/domain/temporal-post/use-case/interactor/create_temporal_post.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { TempPostDITokens } from '@core/domain/temporal-post/di/temp-post_di_tokens';
import {
  InvalidInputException,
  InvalidReferenceException, InvalidReferenceTypeException,
  TempPostException,
} from '@core/domain/temporal-post/use-case/exception/temporal_post.exception';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';


const feature = loadFeature('test/bdd-functional/features/temporal-post/create_temporal_post.feature');

defineFeature(feature, (test) => {
  let owner_id: string;
  let description: string;
  let reference: string;
  let referenceType: string;

  let createUserAccountInteractor: CreateUserAccountInteractor;
  let createTemporalPostInteractor: CreateTemporalPostInteractor;

  let output: CreateTemporalPostOutputModel;
  let exception: TempPostException;

  const user_1 = createUserMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await createUserAccountInteractor.execute(input);
      owner_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  async function createTemporalPost(input: CreateTemporalPostInputModel) {
    try {
      return await createTemporalPostInteractor.execute(input);
    } catch (e) {
      exception = e;
    }
  }


  function givenAnExistingUser(given) {
    given(/^an existing user$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesTemporalPostContent(and) {
    and(/^the user provides content of the temporal post: "([^"]*)", "([^"]*)" and "([^"]*)"$/,
      (input_description, input_reference, input_reference_type) => {
        description = input_description;
        reference = input_reference;
        referenceType = input_reference_type;
      },
    );
  }

  function whenUserTriesToCreateATemporalPost(when) {
    when(/^the user tries to create a new temporal post$/, async () => {
      const input: CreateTemporalPostInputModel = {
        description: description,
        reference: reference,
        referenceType: referenceType,
        owner_id
      };
      output = await createTemporalPost(input);

    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    createUserAccountInteractor = module.get<CreateUserAccountInteractor>(UserDITokens.CreateUserAccountInteractor);
    createTemporalPostInteractor = module.get<CreateTemporalPostInteractor>(TempPostDITokens.CreateTempPostInteractor);
    output = undefined;
    exception = undefined;
  });


  test('A logged user creates a temporal post', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserProvidesTemporalPostContent(and);
    whenUserTriesToCreateATemporalPost(when);
    then(/^the temporal post is created successfully$/, () => {
      expect(output).toBeDefined();
    });
  });

  test('A logged user creates a temporal post with an invalid reference', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserProvidesTemporalPostContent(and);
    whenUserTriesToCreateATemporalPost(when);
    then(/^an error occurs: post must have a valid reference$/, () => {
      expect(exception).toBeInstanceOf(InvalidReferenceException);
      expect(output).toBeUndefined();
    });
  });

  test('A logged user creates a temporal post with an invalid reference type', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserProvidesTemporalPostContent(and);
    whenUserTriesToCreateATemporalPost(when);
    then(/^an error occurs: post must have a valid reference type$/, () => {
      expect(exception).toBeInstanceOf(InvalidReferenceTypeException);
      expect(output).toBeUndefined();
    });
  });

  test('A logged user creates a temporal post without any content', ({ given, and, when, then }) => {
    givenAnExistingUser(given);
    andUserProvidesTemporalPostContent(and);
    whenUserTriesToCreateATemporalPost(when);
    then(/^an error occurs: post must have a valid content$/, () => {
      expect(exception).toBeInstanceOf(InvalidInputException);
      expect(output).toBeUndefined();
    });
  });

});
