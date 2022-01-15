import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import CreateServiceRequestApplicationInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/create_application.input_model';
import { CreateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/create_application.interactor';
import CreateServiceRequestApplicationOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/create_application.output_model';
import { CreateServiceRequestService } from '../create_service_request.service';
import CreateServiceRequestApplicationGateway from '@core/domain/service-request/use-case/gateway/service-request-applications/create_application.gateway';
import { NonExistentServiceRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';

export class CreateServiceRequestApplicationService implements CreateServiceRequestApplicationInteractor {
  private readonly logger: Logger = new Logger(CreateServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: CreateServiceRequestApplicationGateway
  ) {}

  public async execute(input: CreateServiceRequestApplicationInputModel): Promise<CreateServiceRequestApplicationOutputModel> {
    const { applicant_id, request_id, message } = input;
    const existing_request = await this.gateway.findOne({ service_request_id: request_id });
    if (!existing_request){
      throw new NonExistentServiceRequestException();
    }
    const existing_application = await this.gateway.existsApplication( { service_request_id: request_id, owner_id: applicant_id });
    if (existing_application){
      return await this.gateway.removeApplication({
        request_id,
        applicant_id,
      });
    }
    return await this.gateway.createApplication({
      request_id,
      applicant_id,
      message
    });
  }
}
