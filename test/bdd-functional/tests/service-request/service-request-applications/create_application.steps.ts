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
import CreateServiceRequestApplicationOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/create_application.output_model';

const feature = loadFeature('test/bdd-functional/features/service-request/service-request-applications/create_application.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let request_id: string;
  let request_application_message: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let create_service_request_application_interactor: CreateServiceRequestApplicationInteractor;
  let output: CreateServiceRequestApplicationOutputModel;
  let exception: ServiceRequestException;

  const requester_1 = createRequesterMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      const { id } = await create_user_account_interactor.execute(input);
      user_id = id;
    } catch (e) {
      console.log(e);
    }
  }

  function givenAUserExists(given) {
    given(/^a user exists$/, async () => {
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
    and('there exists a service request application from the user',
      async () => {
        try {
          await create_service_request_application_interactor.execute({
            applicant_id: user_id,
            request_id: '1',
            message: ''
          });
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  function andUserProvidesRequestIdAndMessage(and) {
    and(/^the user provides the service request id being "([^"]*)" and application message being "([^"]*)"$/,
      (provided_request_id, request_message) => {
        request_id = provided_request_id;
        request_application_message = request_message;
      }
    );
  }

  function whenUserTriesToCreateServiceRequestApplication(when) {
    when('the user tries to apply to the service request', async () => {
      try {
        output = await create_service_request_application_interactor.execute({
          applicant_id: user_id,
          request_id: request_id,
          message: request_application_message
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
    exception = undefined;
  });

  test('A user tries to apply to a service request that does not exist',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andUserProvidesRequestIdAndMessage(and);
      whenUserTriesToCreateServiceRequestApplication(when);
      then('an error occurs: the service request does not exist', () => {
        expect(exception).toBeInstanceOf(NonExistentServiceRequestException);
      });
    }
  );

  test('A user applies to a service request',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAServiceRequestExists(and);
      andUserProvidesRequestIdAndMessage(and);
      whenUserTriesToCreateServiceRequestApplication(when);
      then('the application is created', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A user applies to a service request they have already applied to',
    ({ given, and, when, then }) => {
      givenAUserExists(given);
      andAServiceRequestExists(and);
      andAServiceRequestApplicationExists(and);
      andUserProvidesRequestIdAndMessage(and);
      whenUserTriesToCreateServiceRequestApplication(when);
      then('the application is removed', () => {
        expect(output).toBeDefined();
      });
    }
  );

});
