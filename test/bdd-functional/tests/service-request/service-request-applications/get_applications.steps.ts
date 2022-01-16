import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import {
  NonExistentServiceRequestException,
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import GetServiceRequestApplicationsOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/get_applications.output_model';
import { GetServiceRequestApplicationsInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/get_applications.interactor';

const feature = loadFeature('test/bdd-functional/features/service-request/service-request-applications/get_applications.feature');

defineFeature(feature, (test) => {
  let owner_id: string;
  let request_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let create_service_request_application_interactor: CreateServiceRequestApplicationInteractor;
  let get_service_request_applications_interactor: GetServiceRequestApplicationsInteractor;
  let output: GetServiceRequestApplicationsOutputModel;
  let exception: ServiceRequestException;

  const requester_1 = createRequesterMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      owner_id = id;
      owner_id;
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

  function andAServiceRequestApplicationExists(and) {
    and(/^there exists a service request application from user with id "([^"]*)", to request with id "([^"]*)" and application message being "([^"]*)"$/,
      async (provided_applicant_id, provided_request_id, provided_message) => {
        try {
          await create_service_request_application_interactor.execute({
            applicant_id: provided_applicant_id,
            request_id: provided_request_id,
            message: provided_message
          });
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  function andRequesterProvidesRequestId(and) {
    and(/^the requester provides the request id being "([^"]*)"$/,
      (provided_request_id) => {
        request_id = provided_request_id;
      }
    );
  }

  function whenUserTriesToGetServiceRequestApplications(when) {
    when('the requester tries to get the service request applications', async () => {
      try {
        output = await get_service_request_applications_interactor.execute({
          request_id,
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
    get_service_request_applications_interactor = module.get<GetServiceRequestApplicationsInteractor>(
      ServiceRequestDITokens.GetServiceRequestApplicationsInteractor
    );
    exception = undefined;
  });

  test('A requester gets the collection of applications to a service request',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andAServiceRequestApplicationExists(and);
      andRequesterProvidesRequestId(and);
      whenUserTriesToGetServiceRequestApplications(when);
      then('the collection of applications is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A requester tries to get the collection of applications to a service request that does not exist',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andRequesterProvidesRequestId(and);
      whenUserTriesToGetServiceRequestApplications(when);
      then('an error occurs: the service request does not exist', () => {
        expect(exception).toBeInstanceOf(NonExistentServiceRequestException);
      });
    }
  );
});
