import { defineFeature, loadFeature } from 'jest-cucumber';
import { createTestModule } from '@test/bdd-functional/tests/create_test_module';
import { CreateUserAccountInteractor } from '@core/domain/user/use-case/interactor/create_user_account.interactor';
import { UserDITokens } from '@core/domain/user/di/user_di_tokens';
import CreateUserAccountInputModel from '@core/domain/user/use-case/input-model/create_user_account.input_model';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import {
  ServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { createRequesterMock } from '@test/bdd-functional/tests/utils/create_requester_mock';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';
import { GetServiceRequestEvaluationApplicantInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/get_evaluation_applicant.interactor';
import GetServiceRequestEvaluationApplicantOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/get_evaluation_applicant.output_model';

const feature = loadFeature('test/bdd-functional/features/service-request/service-request-applications/get_evaluation_applicant.feature');

defineFeature(feature, (test) => {
  let user_id: string;
  let owner_id: string;
  let request_id: string;
  let create_user_account_interactor: CreateUserAccountInteractor;
  let create_service_request_interactor: CreateServiceRequestInteractor;
  let create_service_request_application_interactor: CreateServiceRequestApplicationInteractor;
  let update_service_request_application_interactor: UpdateServiceRequestApplicationInteractor;
  let get_service_request_evaluation_applicant_interactor: GetServiceRequestEvaluationApplicantInteractor;
  let output: GetServiceRequestEvaluationApplicantOutputModel;
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

  function andRequesterProvidesRequestIdAndApplicantId(and) {
    and(/^the requester provides the request id being "([^"]*)"$/,
      (provided_request_id) => {
        request_id = provided_request_id;
      }
    );
  }

  function whenUserTriesToGetServiceRequestApplicant(when) {
    when('the requester tries to get the service request applicant being evaluated', async () => {
      try {
        output = await get_service_request_evaluation_applicant_interactor.execute({
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
    update_service_request_application_interactor = module.get<UpdateServiceRequestApplicationInteractor>(
      ServiceRequestDITokens.UpdateServiceRequestApplicationInteractor
    );
    get_service_request_evaluation_applicant_interactor = module.get<GetServiceRequestEvaluationApplicantInteractor>(
      ServiceRequestDITokens.GetServiceRequestEvaluationApplicantInteractor
    );
    exception = undefined;
  });

  test('A requester gets the user being evaluated to complete a service request',
    ({ given, and, when, then }) => {
      givenARequesterExists(given);
      andAServiceRequestExists(and);
      andAcceptedServiceRequestApplicationExists(and);
      andRequesterProvidesRequestIdAndApplicantId(and);
      whenUserTriesToGetServiceRequestApplicant(when);
      then('the applicant is returned', () => {
        expect(output).toBeDefined();
      });
    }
  );

});
