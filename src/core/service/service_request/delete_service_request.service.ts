import { Inject, Logger } from '@nestjs/common';
import { DeleteServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/delete_service_request.interactor';
import DeleteServiceRequestGateway from '@core/domain/service-request/use-case/gateway/delete_service_request.gateway';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import DeleteServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/delete_service_request.input_model';
import DeleteServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/delete_service_request.output_model';
import {
  InvalidPhaseToDeleteServiceRequestException,
  NonExistentServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';
import { ServiceRequestMapper } from '@core/domain/service-request/use-case/mapper/service_request.mapper';

export class DeleteServiceRequestService implements DeleteServiceRequestInteractor {
  private readonly logger: Logger = new Logger(DeleteServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: DeleteServiceRequestGateway
  ) {}

  public async execute(input: DeleteServiceRequestInputModel): Promise<DeleteServiceRequestOutputModel> {
    const { service_request_id, owner_id } = input;
    const existing_service_request: ServiceRequestDTO = await this.gateway.findOne({ service_request_id });
    if (!existing_service_request)
      throw new NonExistentServiceRequestException();
    const service_request_entity = ServiceRequestMapper.toServiceRequest(existing_service_request);
    if (!service_request_entity.canBeDeleted())
      throw new InvalidPhaseToDeleteServiceRequestException();
    await this.gateway.delete({
      service_request_id,
      owner_id
    });
    return {
      applicants: service_request_entity.applicants,
      title: service_request_entity.title
    };
  }
}
