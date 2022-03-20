import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import { DeleteServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/delete_service_offer.interactor';
import DeleteServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/delete_service_offer.input_model';
import DeleteServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/delete_service_offer.output_model';
import {
  NonExistentServiceOfferException, ServiceOfferDoesNotBelongToUserException,
  ServiceOfferException
} from '@core/domain/service-offer/use-case/exception/service_offer.exception';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';

const feature = loadFeature('test/bdd-functional/features/service-offer/delete_service_offer.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let delete_service_offer_interactor: DeleteServiceOfferInteractor;
  let input: DeleteServiceOfferInputModel = null;
  let output: DeleteServiceOfferOutputModel;
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
        const { owner_id, title, service_brief, contact_information, category } = service_details[0];
        try {
          await create_service_offer_interactor.execute({
            owner_id,
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

  function whenUserTriesToDeleteServiceOffer(when) {
    when(/^the user identified by "([^"]*)" tries to delete the service offer with id "([^"]*)"$/,
      async (owner_id: string, service_offer_id: string) => {
        try {
          input = {
            service_offer_id,
            owner_id
          };
          output = await delete_service_offer_interactor.execute(input);
        } catch (e) {
          exception = e;
        }
      }
    );
  }

  beforeEach(async () => {
    const module = await createTestModule();
    create_user_account_interactor = module.get<CreateUserAccountInteractor>(
      UserDITokens.CreateUserAccountInteractor
    );
    create_service_offer_interactor = module.get<CreateServiceOfferInteractor>(
      ServiceOfferDITokens.CreateServiceOfferInteractor
    );
    delete_service_offer_interactor = module.get<DeleteServiceOfferInteractor>(
      ServiceOfferDITokens.DeleteServiceOfferInteractor
    );
    exception = undefined;
  });

  test('A logged in user successfully deletes a service offer',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAServiceOfferExists(and);
      whenUserTriesToDeleteServiceOffer(when);
      then('the service offer is successfully deleted', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in user tries to delete a service offer that does not exist',
    ({ given, when, then }) => {
      givenTheseUsersExists(given);
      whenUserTriesToDeleteServiceOffer(when);
      then('an error occurs: the service offer to be deleted does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentServiceOfferException);
      });
    }
  );
  test('A logged in user tries to delete a service offer that does not belong to them',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andAServiceOfferExists(and);
      whenUserTriesToDeleteServiceOffer(when);
      then('an error occurs: the service offer does not belong to the user', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(ServiceOfferDoesNotBelongToUserException);
      });
    }
  );
});
