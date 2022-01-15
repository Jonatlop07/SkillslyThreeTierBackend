import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { InvalidServiceRequestPhaseOperationException, NonExistentServiceRequestApplicationException, NonExistentServiceRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import UpdateServiceRequestApplicationInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/update_application.input_model';
import { UpdateServiceRequestApplicationInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/update_application.interactor';
import UpdateServiceRequestApplicationOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/update_application.output_model';
import { UpdateServiceRequestService } from '../update_service_request.service';
import UpdateServiceRequestApplicationGateway from '@core/domain/service-request/use-case/gateway/service-request-applications/update_application.gateway';
import { ServiceRequestMapper } from '@core/domain/service-request/use-case/mapper/service_request.mapper';
import { ServiceRequestApplicationDTO } from '@core/domain/service-request/use-case/persistence-dto/service-request-applications/service_request_application.dto';

export class UpdateServiceRequestApplicationService implements UpdateServiceRequestApplicationInteractor {
  private readonly logger: Logger = new Logger(UpdateServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: UpdateServiceRequestApplicationGateway
  ) {}

  public async execute(input: UpdateServiceRequestApplicationInputModel): Promise<UpdateServiceRequestApplicationOutputModel> {
    const { request_id, applicant_id, application_action } = input;
    const existing_request = await this.gateway.findOne({ service_request_id: request_id });
    const existing_application = await this.gateway.existsApplication({ service_request_id: request_id, owner_id: applicant_id });
    let updated_application: ServiceRequestApplicationDTO;
    if (!existing_request.service_request_id){
      throw new NonExistentServiceRequestException();
    }
    const service_request_entity = ServiceRequestMapper.toServiceRequest(existing_request);
    if (application_action === 'accept'){
      if (!service_request_entity.canBeAccepted()){
        throw new InvalidServiceRequestPhaseOperationException();
      }
      if (!existing_application){
        throw new NonExistentServiceRequestApplicationException();
      }
      updated_application = await this.gateway.acceptApplication({ request_id, applicant_id });
    } else if (application_action === 'confirm'){
      if (!service_request_entity.canBeConfirmedOrDenied()){
        throw new InvalidServiceRequestPhaseOperationException();
      }
      updated_application = await this.gateway.confirmApplication({ request_id, applicant_id });
    } else if (application_action === 'deny'){
      if (!service_request_entity.canBeConfirmedOrDenied()){
        throw new InvalidServiceRequestPhaseOperationException();
      }
      updated_application = await this.gateway.denyApplication({ request_id, applicant_id });
    }

    return {
      request_id: updated_application.request_id,
      applicant_id: updated_application.applicant_id,
      request_phase: updated_application.request_phase
    };
  }
    
}
