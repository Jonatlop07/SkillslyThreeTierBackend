import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import CreateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/create_service_offer.input_model';
import { QueryServiceOfferCollectionInteractor } from '@core/domain/service-offer/use-case/interactor/query_service_offer_collection.interactor';
import QueryServiceOfferCollectionInputModel
  from '@core/domain/service-offer/use-case/input-model/query_service_offer_collection.input_model';
import QueryServiceOfferCollectionOutputModel
  from '@core/domain/service-offer/use-case/output-model/query_service_offer_collection.output_model';

const feature = loadFeature('test/bdd-functional/features/service-offer/query_service_offers_by_user.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let query_service_offers_by_user: QueryServiceOfferCollectionInteractor;
  const input: QueryServiceOfferCollectionInputModel = {
    owner_id: ''
  };
  let output: QueryServiceOfferCollectionOutputModel;

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      return await create_user_account_interactor.execute(input);
    } catch (e) {
      console.error(e);
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

  function andTheseServiceOffersExist(and) {
    and(/^there exist service offers with the details being:$/,
      (service_offers: Array<CreateServiceOfferInputModel>) => {
        service_offers.forEach(async (service_offer: CreateServiceOfferInputModel) => {
          try {
            await create_service_offer_interactor.execute(service_offer);
          } catch (e) {
            console.error(e);
          }
        });
      }
    );
  }

  function whenUserTriesToQueryServiceOffersOfAnotherUser(when) {
    when(/^a user tries to query the service offers of the user "([^"]*)"$/,
      async (provided_owner_id: string) => {
        try {
          input.owner_id = provided_owner_id;
          output = await query_service_offers_by_user.execute(input);
        } catch (e) {
          console.error(e);
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
    query_service_offers_by_user = module.get<QueryServiceOfferCollectionInteractor>(
      ServiceOfferDITokens.QueryServiceOfferCollectionInteractor
    );
  });

  test('A user successfully queries the service offers of another user',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andTheseServiceOffersExist(and);
      whenUserTriesToQueryServiceOffersOfAnotherUser(when);
      then('the service offers of the user are returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
