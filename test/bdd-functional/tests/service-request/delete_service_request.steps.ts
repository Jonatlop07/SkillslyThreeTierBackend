import { defineFeature, loadFeature } from 'jest-cucumber';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';
import {
  NonExistentServiceRequestException,
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { DeleteServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/delete_service_request.interactor';
import DeleteServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/delete_service_request.input_model';
import DeleteServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/delete_service_request.output_model';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';

const feature = loadFeature('test/bdd-functional/features/service-request/delete_service_request.feature');

defineFeature(feature, (test) => {
  let owner_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let delete_service_request_interactor: DeleteServiceRequestInteractor;
  let input: DeleteServiceRequestInputModel = null;
  let output: DeleteServiceRequestOutputModel;
  let exception: ServiceRequestException;

  const requester_1 = createRequesterMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      owner_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenARequesterExists(given) {
    given(/^a requester exists$/, async () => {
      await createUserAccount(requester_1);
    });
  }

  function andAServiceRequestExists(given) {
    given(/there exists a service request with the details being:/,
      async (service_details) => {
        const { requester_id, title, service_brief, contact_information, category } = service_details[0];
        owner_id = requester_id;
        try {
          await create_service_request_interactor.execute({
            requester_id,
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

  function whenRequesterTriesToDeleteServiceRequest(when) {
    when(/^the requester tries to delete the service request with id "([^"]*)"$/,
      async (service_request_id: string) => {
        try {
          input = {
            service_request_id,
            owner_id
          };
          output = await delete_service_request_interactor.execute(input);
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
    create_service_request_interactor = module.get<CreateServiceRequestInteractor>(
      ServiceRequestDITokens.CreateServiceRequestInteractor
    );
    delete_service_request_interactor = module.get<DeleteServiceRequestInteractor>(
      ServiceRequestDITokens.DeleteServiceRequestInteractor
    );
    exception = undefined;
  });

  test('A logged in requester successfully deletes a service request',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      whenRequesterTriesToDeleteServiceRequest(when);
      then('the service request is successfully deleted', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in requester tries to delete a service request that does not exist',
    ({ given, when, then }) => {
      givenARequesterExists(given);
      whenRequesterTriesToDeleteServiceRequest(when);
      then('an error occurs: the service request to be deleted does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentServiceRequestException);
      });
    }
  );
});
