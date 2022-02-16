import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  InvalidServiceOfferDetailsFormatException,
  ServiceOfferException
} from '@core/domain/service-offer/use-case/exception/service_offer.exception';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import CreateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/create_service_offer.input_model';
import CreateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/create_service_offer.output_model';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';

const feature = loadFeature('test/bdd-functional/features/service-offer/create_service_offer.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let input: CreateServiceOfferInputModel = {
    owner_id: '',
    title: '',
    service_brief: '',
    contact_information: '',
    category: ''
  };
  let output: CreateServiceOfferOutputModel;
  let exception: ServiceOfferException;

  const user_1 = createUserMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andUserProvidesDetailsOfTheService(given) {
    given(/the user provides the details of the service being:/,
      (service_details) => {
        const { owner_id, title, service_brief, contact_information, category } = service_details[0];
        input = {
          owner_id,
          title,
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
      ServiceOfferDITokens.CreateServiceOfferInteractor
    );
    exception = undefined;
  });

  test('A logged in user successfully creates a service offer',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesDetailsOfTheService(and);
      whenUserTriesToCreateServiceOffer(when);
      then('the service offer is created successfully with the details provided', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in user tries to create a service offer but with the details in a invalid format',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesDetailsOfTheService(and);
      whenUserTriesToCreateServiceOffer(when);
      then('an error occurs: the service details are in an invalid format', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(InvalidServiceOfferDetailsFormatException);
      });
    }
  );
});
