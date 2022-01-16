import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  InvalidServiceOfferDetailsFormatException, NonExistentServiceOfferException, ServiceOfferDoesNotBelongToUserException,
  ServiceOfferException
} from '@core/domain/service-offer/use-case/exception/service_offer.exception';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import { UpdateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/update_service_offer.interactor';
import UpdateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/update_service_offer.input_model';
import UpdateServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/update_service_offer.output_model';

const feature = loadFeature('test/bdd-functional/features/service-offer/update_service_offer.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let update_service_offer_interactor: UpdateServiceOfferInteractor;
  let input: UpdateServiceOfferInputModel = null;
  let output: UpdateServiceOfferOutputModel;
  let exception: ServiceOfferException;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      return await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenTheseUsersExists(given) {
    given(/^these users exists:$/,
      (users: Array<CreateUserAccountInputModel>) => {
        users.forEach(async (user: CreateUserAccountInputModel) => {
          await createUserAccount(user);
        });
      }
    );
  }

  function andAServiceOfferExists(given) {
    given(/there exists a service offer with the details being:/,
      async (service_details) => {
        const { user_id, title, service_brief, contact_information, category } = service_details[0];
        try {
          await create_service_offer_interactor.execute({
            user_id,
            title,
            service_brief,
            contact_information,
            category
          });
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  function andUserProvidesDetailsOfServiceOfferToBeUpdated(and) {
    and(/^the user identified by "([^"]*)" provides the details of the offer to be updated:$/,
      (owner_id: string, service_details) => {
        const { service_offer_id, title, service_brief, contact_information, category } = service_details[0];
        input = {
          service_offer_id,
          owner_id,
          title,
          service_brief,
          contact_information,
          category
        };
      }
    );
  }

  function whenUserTriesToUpdateServiceOfferDetails(when) {
    when('the user tries to update the details of the service offer', async () => {
      try {
        output = await update_service_offer_interactor.execute(input);
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
    update_service_offer_interactor = module.get<UpdateServiceOfferInteractor>(
      ServiceOfferDITokens.UpdateServiceOfferInteractor
    );
    exception = undefined;
  });

  test('A logged in user successfully updates a service offer',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAServiceOfferExists(and);
      andUserProvidesDetailsOfServiceOfferToBeUpdated(and);
      whenUserTriesToUpdateServiceOfferDetails(when);
      then('the service offer is updated successfully with the details provided', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in user tries to update a service offer but with the details in a invalid format',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAServiceOfferExists(and);
      andUserProvidesDetailsOfServiceOfferToBeUpdated(and);
      whenUserTriesToUpdateServiceOfferDetails(when);
      then('an error occurs: some details of the service offer are in an invalid format', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(InvalidServiceOfferDetailsFormatException);
      });
    }
  );
  test('A logged in user tries to update a service offer that does not exist',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andUserProvidesDetailsOfServiceOfferToBeUpdated(and);
      whenUserTriesToUpdateServiceOfferDetails(when);
      then('an error occurs: the service offer to be updated does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentServiceOfferException);
      });
    }
  );
  test('A logged in user tries to update a service offer that does not belong to them',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAServiceOfferExists(and);
      andUserProvidesDetailsOfServiceOfferToBeUpdated(and);
      whenUserTriesToUpdateServiceOfferDetails(when);
      then('an error occurs: the service offer does not belong to the user', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(ServiceOfferDoesNotBelongToUserException);
      });
    }
  );
});
