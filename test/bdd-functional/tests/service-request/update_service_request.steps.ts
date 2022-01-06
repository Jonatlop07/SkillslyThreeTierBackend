import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { UpdateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_offer.interactor';
import UpdateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/update_service_request.input_model';
import UpdateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/update_service_request.output_model';
import {
  InvalidServiceRequestDetailsFormatException, NonExistentServiceRequestException,
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';

const feature = loadFeature('test/bdd-functional/features/service-request/update_service_request.feature');

defineFeature(feature, (test) => {
  let owner_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let update_service_request_interactor: UpdateServiceRequestInteractor;
  let input: UpdateServiceRequestInputModel = null;
  let output: UpdateServiceRequestOutputModel;
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

  function andRequesterProvidesDetailsOfServiceRequestToBeUpdated(and) {
    and(/the requester provides the details of the request to be updated:/,
      (service_details) => {
        const { service_request_id, title, service_brief, contact_information, category } = service_details[0];
        input = {
          service_request_id,
          owner_id,
          title,
          service_brief,
          contact_information,
          category
        };
      }
    );
  }

  function whenRequesterTriesToUpdateServiceRequestDetails(when) {
    when('the requester tries to update the details of the service request', async () => {
      try {
        output = await update_service_request_interactor.execute(input);
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
    create_service_request_interactor = module.get<CreateServiceRequestInteractor>(
      ServiceRequestDITokens.CreateServiceRequestInteractor
    );
    update_service_request_interactor = module.get<UpdateServiceRequestInteractor>(
      ServiceRequestDITokens.UpdateServiceRequestInteractor
    );
    exception = undefined;
  });

  test('A logged in requester successfully updates a service request',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andRequesterProvidesDetailsOfServiceRequestToBeUpdated(and);
      whenRequesterTriesToUpdateServiceRequestDetails(when);
      then('the service request is updated successfully with the details provided', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in requester tries to update a service request but with the details in a invalid format',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andRequesterProvidesDetailsOfServiceRequestToBeUpdated(and);
      whenRequesterTriesToUpdateServiceRequestDetails(when);
      then('an error occurs: some details of the service request are in an invalid format', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(InvalidServiceRequestDetailsFormatException);
      });
    }
  );
  test('A logged in requester tries to update a service request that does not exist',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andRequesterProvidesDetailsOfServiceRequestToBeUpdated(and);
      whenRequesterTriesToUpdateServiceRequestDetails(when);
      then('an error occurs: the service request to be updated does not exist', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(NonExistentServiceRequestException);
      });
    }
  );
});
