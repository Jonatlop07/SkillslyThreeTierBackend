import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import {
  InvalidServiceRequestPhaseOperationException,
  NonExistentServiceRequestApplicationException,
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import UpdateServiceRequestApplicationOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/update_application.output_model';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';

const feature = loadFeature('test/bdd-functional/features/service-request/service-request-applications/update_request_application.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let owner_id: string;
  let request_id: string;
  let applicant_id: string;
  let application_action: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let create_service_request_application_interactor: CreateServiceRequestApplicationInteractor;
  let update_service_request_application_interactor: UpdateServiceRequestApplicationInteractor;
  let output: UpdateServiceRequestApplicationOutputModel;
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


  function andAcceptedServiceRequestApplicationExists(and) {
    and(/^there exists a service request application from user with id "([^"]*)", to request with id "([^"]*)" that has been accepted$/,
      async (existing_applicant_id, existing_request_id) => {
        try {
          await create_service_request_application_interactor.execute({
            applicant_id: existing_applicant_id,
            request_id: existing_request_id,
            message: ''
          });
          await update_service_request_application_interactor.execute({
            user_id: owner_id,
            request_id: existing_request_id,
            applicant_id: existing_applicant_id,
            application_action: 'accept'
          });
        } catch (e) {
          console.error(e);
        }
      }
    );
  }

  function andRequesterProvidesRequestIdAndAction(and) {
    and(/^the requester provides the request id being "([^"]*)", applicant id being "([^"]*)" and action being "([^"]*)"$/,
      (provided_request_id, provided_applicant_id, provided_action) => {
        request_id = provided_request_id;
        applicant_id = provided_applicant_id;
        application_action = provided_action;
      }
    );
  }

  function whenUserTriesToUpdateServiceRequestApplication(when) {
    when('the requester tries to update the service request application', async () => {
      try {
        output = await update_service_request_application_interactor.execute({
          user_id,
          request_id,
          applicant_id,
          application_action
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
    exception = undefined;
  });

  test('A service requester accepts an existing service request application',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andAServiceRequestApplicationExists(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateServiceRequestApplication(when);
      then('the application is accepted and the service phase is updated to evaluation', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A service requester confirms an existing service request application in evaluation phase',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateServiceRequestApplication(when);
      then('the application is accepted and the service phase is updated to execution', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A service requester denies an existing service request application',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateServiceRequestApplication(when);
      then('the application is denied and the service goes back to open', () => {
        expect(output).toBeDefined();
      });
    }
  );

  test('A service requester tries to accept a service request application but the request is in evaluation phase',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andAServiceRequestApplicationExists(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateServiceRequestApplication(when);
      then('an error occurs: a service request application is already being evaluated for the request therefore the owner can not accept another one', () => {
        expect(exception).toBeInstanceOf(InvalidServiceRequestPhaseOperationException);
      });
    }
  );

  test('A service requester tries to accept a service request application that does not exist',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andRequesterProvidesRequestIdAndAction(and);
      whenUserTriesToUpdateServiceRequestApplication(when);
      then('an error occurs: the service request application to accept does not exist', () => {
        expect(exception).toBeInstanceOf(NonExistentServiceRequestApplicationException);
      });
    }
  );
});
