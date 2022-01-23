import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { ServiceRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { CreateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/request_cancel_or_completion.interactor';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';
import { UpdateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_status_update_request.interactor';
import UpdateServiceStatusUpdateRequestOutputModel from '@core/domain/service-request/use-case/output-model/update_service_status_update_request.output_model';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '../create_test_module';
import { createRequesterMock } from '../utils/create_requester_mock';

const feature = loadFeature('test/bdd-functional/features/service-request/update_service_status_update_request.feature');

defineFeature(feature, (test) => {

  let provider_id: string;
  let owner_id: string;
  let request_id: string;
  let update_request_action: string; 
  let update_service_status_update_request_action: string; 
  
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let create_service_request_application_interactor: CreateServiceRequestApplicationInteractor;
  let update_service_request_application_interactor: UpdateServiceRequestApplicationInteractor;
  let create_service_status_update_request_interactor: CreateServiceStatusUpdateRequestInteractor;
  let update_service_status_update_request_interactor: UpdateServiceStatusUpdateRequestInteractor;
  let output: UpdateServiceStatusUpdateRequestOutputModel;
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

  function andProviderProvidesRequestIdAndAction(and) {
    and(/^the provider provides the id of the service request being "([^"]*)" and action being "([^"]*)"$/,
      (provided_request_id, provided_action) => {
        request_id = provided_request_id;
        update_request_action = provided_action;
      }
    );
  }

  function andTheCompletionOrDeletionRequestIsCreated(and) {
    and('the completion or deletion request is created', 
      async () => {
        try {
          await create_service_status_update_request_interactor.execute({
            provider_id,
            service_request_id: request_id,
            update_request_action,
          });
        } catch (e) {
          exception = e;
        }
      }
    );
  }

  function andRequesterProvidesRequestIdAndAction(and) {
    and(/^the requester provides the id of the service request being "([^"]*)" and action being "([^"]*)"$/,
      (provided_request_id, provided_action) => {
        request_id = provided_request_id;
        update_service_status_update_request_action = provided_action;
      }
    );
  }

  function whenUserTriesToUpdateCompletionOrDeletionRequest(when) {
    when('the requester tries to update the completion or deletion request', async () => {
      try {
        output = await update_service_status_update_request_interactor.execute({
          provider_id,
          requester_id: owner_id,
          service_request_id: request_id,
          update_service_status_update_request_action,
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
    update_service_status_update_request_interactor = module.get<UpdateServiceStatusUpdateRequestInteractor>(
      ServiceRequestDITokens.UpdateServiceStatusUpdateRequestInteractor
    )
    exception = undefined;
  });

  test('A requester accept a service completion or deletion request',
    ({ given, and, when, then }) => {
      givenAProviderExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andProviderProvidesRequestIdAndAction(and);
      andTheCompletionOrDeletionRequestIsCreated(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateCompletionOrDeletionRequest(when);
      then('the completion or deletion request is accepted and the service request status is updated to closed', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A requester cancel a service completion or deletion request',
    ({ given, and, when, then }) => {
      givenAProviderExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andProviderProvidesRequestIdAndAction(and);
      andTheCompletionOrDeletionRequestIsCreated(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateCompletionOrDeletionRequest(when);
      then('the completion or deletion request is canceled', () => {
        expect(output).toBeDefined();
      });
    }
  );

});
