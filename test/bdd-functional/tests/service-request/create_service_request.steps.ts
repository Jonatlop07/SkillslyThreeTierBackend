import { defineFeature, loadFeature } from 'jest-cucumber';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import {
  InvalidServiceRequestDetailsFormatException,
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import CreateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/create_service_request.input_model';
import CreateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/create_service_request.output_model';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';

const feature = loadFeature('test/bdd-functional/features/service-request/create_service_request.feature');

defineFeature(feature, (test) => {
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let input: CreateServiceRequestInputModel = {
    requester_id: '',
    title: '',
    service_brief: '',
    contact_information: '',
    category: ''
  };
  let output: CreateServiceRequestOutputModel;
  let exception: ServiceRequestException;

  const requester_1 = createRequesterMock();

  async function createUserAccount(input: CreateUserAccountInputModel) {
    try {
      await create_user_account_interactor.execute(input);
    } catch (e) {
      console.log(e);
    }
  }

  function givenARequesterExists(given) {
    given(/^a requester exists$/, async () => {
      await createUserAccount(requester_1);
    });
  }

  function andRequesterProvidesDetailsOfTheService(given) {
    given(/the requester provides the details of the service being:/,
      (service_details) => {
        const { requester_id, title, service_brief, contact_information, category } = service_details[0];
        input = {
          requester_id,
          title,
          service_brief,
          contact_information,
          category
        };
      }
    );
  }

  function whenRequesterTriesToCreateServiceRequest(when) {
    when('the requester tries to create the service request', async () => {
      try {
        output = await create_service_request_interactor.execute(input);
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
    exception = undefined;
  });

  test('A logged in requester successfully creates a service request',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andRequesterProvidesDetailsOfTheService(and);
      whenRequesterTriesToCreateServiceRequest(when);
      then('the service request is created successfully with the details provided', () => {
        expect(output).toBeDefined();
      });
    }
  );
  test('A logged in requester tries to create a service request but with the details in a invalid format',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andRequesterProvidesDetailsOfTheService(and);
      whenRequesterTriesToCreateServiceRequest(when);
      then('an error occurs: the service details are in an invalid format', () => {
        expect(exception).toBeDefined();
        expect(exception).toBeInstanceOf(InvalidServiceRequestDetailsFormatException);
      });
    }
  );
});
