import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateServiceOfferInteractor } from '@core/domain/service-offer/use-case/interactor/create_service_offer.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ServiceOfferDITokens } from '@core/domain/service-offer/di/service_offer_di_tokens';
import CreateServiceOfferInputModel
  from '@core/domain/service-offer/use-case/input-model/create_service_offer.input_model';

const feature = loadFeature('test/bdd-functional/features/service-offer/query_service_offers_by_categories.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_offer_interactor: CreateServiceOfferInteractor;
  let query_service_offers_by_categories_interactor: QueryServiceOffersByCategoriesInteractor;
  let input: QueryServiceOffersByCategoriesInputModel;
  let output: QueryServiceOffersByCategoriesOutputModel;

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

  function andUserProvidesCategories(and) {
    and(/a user provides the following categories:/,
      (categories: Array<string>) => {
        input.categories = categories;
      }
    );
  }

  function whenUserQueriesServiceOffersByCategories(when) {
    when('the user queries the service offers by the provided categories', async () => {
      try {
        output = await query_service_offers_by_categories_interactor.execute(input);
      } catch (e) {
        console.error(e);
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
    query_service_offers_by_categories_interactor = module.get<QueryServiceOffersByCategoriesInteractor>(
      ServiceOfferDITokens.QueryServiceOffersByCategoriesInteractor
    );
  });

  test('',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andTheseServiceOffersExist(and);
      andUserProvidesCategories(and);
      whenUserQueriesServiceOffersByCategories(when);
      then('the matching service offers are returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
