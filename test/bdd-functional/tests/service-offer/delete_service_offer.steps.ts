import { defineFeature, loadFeature } from 'jest-cucumber';
import { createUserMock } from '@test/bdd-functional/tests/utils/create_user_mock';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import { DeleteServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/delete_service_offer.interactor';
import DeleteServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/delete_service_offer.input_model';
import DeleteServiceOfferOutputModel
  from '@core/domain/service-offer/use-case/output-model/delete_service_offer.output_model';
import {
  NonExistentServiceOfferException,
  ServiceOfferException
} from '@core/domain/service-offer/use-case/exception/service_offer.exception';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';

const feature = loadFeature('test/bdd-functional/features/service-offer/delete_service_offer.feature');

defineFeature(feature, (test) => {
  let owner_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let delete_service_offer_interactor: DeleteServiceOfferInteractor;
  let input: DeleteServiceOfferInputModel = null;
  let output: DeleteServiceOfferOutputModel;
  let exception: ServiceOfferException;

  const user_1 = createUserMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      owner_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
      await createUserAccount(user_1);
    });
  }

  function andAServiceOfferExists(given) {
    given(/there exists a service offer with the details being:/,
      async (service_details) => {
        const { user_id, title, service_brief, contact_information, category } = service_details[0];
        owner_id = user_id;
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

  function whenUserTriesToDeleteServiceOffer(when) {
    when(/^the user tries to delete the service offer with id "([^"]*)"$/,
      async (service_offer_id: string) => {
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
      givenAUserExists(given);
      andAServiceOfferExists(and);
      whenUserTriesToDeleteServiceOffer(when);
      then('the service offer is successfully deleted', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in user tries to delete a service offer that does not exist',
    ({ given, when, then }) => {
      givenAUserExists(given);
      whenUserTriesToDeleteServiceOffer(when);
      then('an error occurs: the service offer to be deleted does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentServiceOfferException);
      });
    }
  );
});
