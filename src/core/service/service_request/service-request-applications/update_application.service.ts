import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { NonExistentServiceRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import UpdateServiceRequestApplicationInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/update_application.input_model';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';
import UpdateServiceRequestApplicationOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/update_application.output_model';
import { UpdateServiceRequestService } from '../update_service_request.service';
import UpdateServiceRequestApplicationGateway from '@core/domain/service-request/use-case/gateway/service-request-applications/update_application.gateway';

export class UpdateServiceRequestApplicationService implements UpdateServiceRequestApplicationInteractor {
  private readonly logger: Logger = new Logger(UpdateServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: UpdateServiceRequestApplicationGateway
  ) {}

  public async execute(input: UpdateServiceRequestApplicationInputModel): Promise<UpdateServiceRequestApplicationOutputModel> {
    const { request_id, applicant_id, application_action } = input;
    const existing_request = this.gateway.findOne({ service_request_id: request_id });
    if (!existing_request){
      throw new NonExistentServiceRequestException();
    }
    
  }
}
