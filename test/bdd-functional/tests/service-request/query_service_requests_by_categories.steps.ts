import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { QueryServiceRequestCollectionInteractor } from '@core/domain/service-request/use-case/interactor/query_service_request_collection.interactor';
import QueryServiceRequestCollectionInputModel
  from '@core/domain/service-request/use-case/input-model/query_service_request_collection.input_model';
import QueryServiceRequestCollectionOutputModel
  from '@core/domain/service-request/use-case/output-model/query_service_request_collection.output_model';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import CreateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/create_service_request.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';

const feature = loadFeature('test/bdd-functional/features/service-request/query_service_requests_by_categories.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let query_service_request_collection_interactor: QueryServiceRequestCollectionInteractor;
  const input: QueryServiceRequestCollectionInputModel = {
    categories: []
  };
  let output: QueryServiceRequestCollectionOutputModel;

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

  function andTheseServiceRequestsExist(and) {
    and(/^there exist service requests with the details being:$/,
      (service_requests: Array<CreateServiceRequestInputModel>) => {
        service_requests.forEach(async (service_request: CreateServiceRequestInputModel) => {
          try {
            await create_service_request_interactor.execute(service_request);
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

  function whenUserQueriesServiceRequestsByCategories(when) {
    when('the user queries the service requests by the provided categories', async () => {
      try {
        output = await query_service_request_collection_interactor.execute(input);
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
    create_service_request_interactor = module.get<CreateServiceRequestInteractor>(
      ServiceRequestDITokens.CreateServiceRequestInteractor
    );
    query_service_request_collection_interactor = module.get<QueryServiceRequestCollectionInteractor>(
      ServiceRequestDITokens.QueryServiceRequestCollectionInteractor
    );
  });

  test('A user successfully queries the service requests by categories',
    ({ given, and, when, then }) => {
      givenTheseUsersExists(given);
      andTheseServiceRequestsExist(and);
      andUserProvidesCategories(and);
      whenUserQueriesServiceRequestsByCategories(when);
      then('the matching service requests are returned', () => {
        expect(output).toBeDefined();
      });
    }
  );
});
