import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { PostDITokens } from '@core/domain/post/di/post_di_tokens';

const feature = loadFeature('test/bdd-functional/features/post/create_service_offer.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let input: CreateServiceOfferInputModel = {
    user_id: '',
    service_brief: '',
    contact_information: '',
    category: ''
  };
  let output: CreateServiceOfferOutputModel;
  let exception: ServiceException;

  const user_1 = {
    email: 'newuser_123@test.com',
    password: 'Abc123_tr',
    name: 'Juan',
    date_of_birth: '01/01/2000',
    is_investor: false,
    is_requester: false
  };

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      input.user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesInformationOfTheService(given) {
    given('the user provides the information of the service being:',
      (service_information) => {
        const { user_id, service_brief, contact_information, category } = service_information;
        input = {
          user_id,
          service_brief,
          contact_information,
          category
        };
      }
    );
  }

  function whenUserTriesToCreateServiceOffer(when) {
    when('the user tries to create the service offer', async () => {
      try {
        output = await create_service_offer_interactor.execute(input);
      } catch (e) {
        exception = e;
      }
    });
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor
    );
    create_service_offer_interactor = module.get<CreateServiceOfferInteractor>(
      PostDITokens.CreateServiceOfferInteractor
    );
    exception = undefined;
  });

  test('A logged in user creates a permanent post successfully',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesInformationOfTheService(and);
      whenUserTriesToCreateServiceOffer(when);
      then('the service offer is created successfully with the information provided', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in user creates a permanent post successfully',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesInformationOfTheService(and);
      whenUserTriesToCreateServiceOffer(when);
      then('an error occurs: the service information is in an invalid format', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(InvalidServiceOfferInformationFormat);
      });
    }
  );
});
