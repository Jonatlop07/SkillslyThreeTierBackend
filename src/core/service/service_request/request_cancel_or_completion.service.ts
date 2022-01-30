import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceStatusUpdateRequestInteractor } from '@core/domain/service-request/use-case/interactor/request_cancel_or_completion.interactor';
import CreateServiceStatusUpdateRequestInputModel from '@core/domain/service-request/use-case/input-model/request_cancel_or_completion.input_model';
import CreateServiceStatusUpdateRequestOutputModel from '@core/domain/service-request/use-case/output-model/request_cancel_or_completion.output_model';
import CreateServiceStatusUpdateRequestGateway from '@core/domain/service-request/use-case/gateway/request_cancel_or_completion.gateway';
import { AlreadyExistingStatusUpdateRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import { UpdateRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request_update_request.dto';
import { RequestStatusUpdateAction } from '@core/domain/service-request/entity/type/request_status_update_action.enum';

export class CreateServiceStatusUpdateRequestService implements CreateServiceStatusUpdateRequestInteractor {
  private readonly logger: Logger = new Logger(CreateServiceStatusUpdateRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: CreateServiceStatusUpdateRequestGateway
  ) {}

  public async execute(input: CreateServiceStatusUpdateRequestInputModel): Promise<CreateServiceStatusUpdateRequestOutputModel> {
    const { provider_id, service_request_id, update_request_action } = input;
    let created_request: UpdateRequestDTO;
    const existing_request = await this.gateway.existsRequest({ provider_id, service_request_id });
    if (existing_request){
      throw new AlreadyExistingStatusUpdateRequestException();
    }
    if (update_request_action === RequestStatusUpdateAction.Complete){
      created_request = await this.gateway.createCompleteRequest({ provider_id,  service_request_id });
    } else if (update_request_action === RequestStatusUpdateAction.Cancel){
      created_request = await this.gateway.createCancelRequest({ provider_id, service_request_id });
    }
    return {
      service_request_id: created_request.service_request_id,
      service_request_title: created_request.service_request_title,
      provider_id: created_request.provider_id,
      request_date: created_request.request_date ? created_request.request_date : '',
      action: update_request_action,
      requester_id: created_request.requester_id ? created_request.requester_id : '',
      provider_name: created_request.provider_name ? created_request.provider_name : ''
    };
  }
}
