import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { NonExistentStatusUpdateRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import UpdateServiceStatusUpdateRequestGateway from '@core/domain/service-request/use-case/gateway/update_service_status_update_request.gateway';
import UpdateServiceStatusUpdateRequestInputModel from '@core/domain/service-request/use-case/input-model/update_service_status_update_request_action';
import { UpdateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_status_update_request.interactor';
import UpdateServiceStatusUpdateRequestOutputModel from '@core/domain/service-request/use-case/output-model/update_service_status_update_request.output_model';
import { UpdateRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request_update_request.dto';
import { Inject, Logger } from '@nestjs/common';

export class UpdateServiceStatusUpdateRequestService implements UpdateServiceStatusUpdateRequestInteractor {
  private readonly logger: Logger = new Logger(UpdateServiceStatusUpdateRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: UpdateServiceStatusUpdateRequestGateway
  ) {}

  public async execute(input: UpdateServiceStatusUpdateRequestInputModel): Promise<UpdateServiceStatusUpdateRequestOutputModel> {
    const { provider_id, requester_id, service_request_id, update_service_status_update_request_action } = input;
    let updated_request: UpdateRequestDTO;
    let requestedUpdateStatusIsCompletion: boolean; 
    const existing_request = await this.gateway.findOne({ service_request_id, owner_id:requester_id });
    if (!existing_request){
      throw new NonExistentStatusUpdateRequestException();
    } else {
      if (existing_request.requested_status_update == 'REQUESTS_COMPLETION') {
        requestedUpdateStatusIsCompletion = true; 
      } else {
        requestedUpdateStatusIsCompletion = false; 
      }
    }
    if (update_service_status_update_request_action == 'complete'){
      updated_request = await this.gateway.completeRequest({ provider_id,  service_request_id, requester_id }, requestedUpdateStatusIsCompletion);
    } else if (update_service_status_update_request_action == 'cancel'){
      updated_request = await this.gateway.cancelRequest({ provider_id, service_request_id, requester_id });
    }
    return {
      service_request_id: updated_request.service_request_id,
      service_request_title: updated_request.service_request_title,
      provider_id: updated_request.provider_id,
      request_date: updated_request.request_date ? updated_request.request_date : '',
      action: update_service_status_update_request_action,
      requester_id: updated_request.requester_id ? updated_request.requester_id : '',
      requester_name: updated_request.requester_name ? updated_request.requester_name : '',
      phase: updated_request.phase ? updated_request.phase : ''
    };
  }
}