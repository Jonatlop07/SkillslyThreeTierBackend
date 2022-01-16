import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import {
  AlreadyExistingStatusUpdateRequestException,
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';
import { CreateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/request_cancel_or_completion.interactor';
import CreateServiceStatusUpdateRequestOutputModel from '@core/domain/service-request/use-case/output-model/request_cancel_or_completion.output_model';

const feature = loadFeature('test/bdd-functional/features/service-request/request_cancel_or_completion.feature');

defineFeature(feature, (test) => {
  let provider_id: string;
  let owner_id: string;
  let request_id: string;
  let update_request_action: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let create_service_request_application_interactor: CreateServiceRequestApplicationInteractor;
  let update_service_request_application_interactor: UpdateServiceRequestApplicationInteractor;
  let create_service_status_update_request_interactor: CreateServiceStatusUpdateRequestInteractor;
  let output: CreateServiceStatusUpdateRequestOutputModel;
  let exception: ServiceRequestException;

  const requester_1 = createRequesterMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      provider_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAProviderExists(given) {
    given(/^a provider exists$/, async () => {
      await createUserAccount(requester_1);
    });
  }

  function andAServiceRequestExists(given) {
    given(/there exists a service request with the details being:/,
      async (service_details) => {
        const { requester_id, title, service_brief, contact_information, category } = service_details[0];
        try {
          owner_id = requester_id;
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


  function andAcceptedServiceRequestApplicationExists(and) {
    and('there exists a service request application from the provider to the service request that has been accepted',
      async () => {
        try {
          await create_service_request_application_interactor.execute({
            applicant_id: provider_id,
            request_id: '1',
            message: ''
          });
          await update_service_request_application_interactor.execute({
            user_id: owner_id,
            request_id: '1',
            applicant_id: provider_id,
            application_action: 'accept'
          });
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  function andServiceRequestStatusUpdateRequestExists(and) {
    and('there already exists a request to complete or cancel the service from the provider',
      async () => {
        try {
          await create_service_status_update_request_interactor.execute({
            provider_id,
            service_request_id: '1',
            update_request_action: 'complete',
          });
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  function andProviderProvidesRequestIdAndAction(and) {
    and(/^the provider provides the id of the service request being "([^"]*)" and action being "([^"]*)"$/,
      (provided_request_id, provided_action) => {
        request_id = provided_request_id;
        update_request_action = provided_action;
      }
    );
  }

  function whenUserTriesToCreateStatusUpdateRequest(when) {
    when('the provider tries to request to update the service status', async () => {
      try {
        output = await create_service_status_update_request_interactor.execute({
          provider_id,
          service_request_id: request_id,
          update_request_action,
        });
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
    create_service_request_application_interactor = module.get<CreateServiceRequestApplicationInteractor>(
      ServiceRequestDITokens.CreateServiceRequestApplicationInteractor
    );
    update_service_request_application_interactor = module.get<UpdateServiceRequestApplicationInteractor>(
      ServiceRequestDITokens.UpdateServiceRequestApplicationInteractor
    );
    create_service_status_update_request_interactor = module.get<CreateServiceStatusUpdateRequestInteractor>(
      ServiceRequestDITokens.CreateServiceStatusUpdateRequestInteractor
    );
    exception = undefined;
  });

  test('A provider creates a service completion request',
    ({ given, and, when, then }) => {
      givenAProviderExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andProviderProvidesRequestIdAndAction(and);
      whenUserTriesToCreateStatusUpdateRequest(when);
      then('the completion request is created', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A provider creates a service cancelling request',
    ({ given, and, when, then }) => {
      givenAProviderExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andProviderProvidesRequestIdAndAction(and);
      whenUserTriesToCreateStatusUpdateRequest(when);
      then('the deletion request is created', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A provider tries to create a service completion request but they have already requested it',
    ({ given, and, when, then }) => {
      givenAProviderExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andServiceRequestStatusUpdateRequestExists(and);
      andProviderProvidesRequestIdAndAction(and);
      whenUserTriesToCreateStatusUpdateRequest(when);
      then('an error occurs: a request to complete or cancel the service already exists', () => {
        expect(exception).toBeInstanceOf(AlreadyExistingStatusUpdateRequestException);
      });
    }
  );
});
