import { UpdateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/update_service_offer.interactor';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import UpdateServiceRequestGateway from '@core/domain/service-request/use-case/gateway/update_service_request.gateway';
import UpdateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/update_service_request.input_model';
import UpdateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/update_service_request.output_model';
import { Inject } from '@nestjs/common';
import {
  InvalidServiceRequestDetailsFormatException,
  NonExistentServiceRequestException
} from '@core/domain/service-request/use-case/exception/service_request.exception';
import {
  isValidServiceRequestCategory,
  isValidServiceRequestContactInformation,
  isValidServiceRequestServiceBrief,
  isValidServiceRequestTitle
} from '@core/common/util/validators/service_request_validators';
import { ServiceRequestDTO } from '@core/domain/service-request/use-case/persistence-dto/service_request.dto';

export class UpdateServiceRequestService implements UpdateServiceRequestInteractor {
  constructor(
    @Inject(ServiceRequestDITokens.UpdateServiceRequestInteractor)
    private readonly gateway: UpdateServiceRequestGateway
  ) {
  }

  public async execute(input: UpdateServiceRequestInputModel): Promise<UpdateServiceRequestOutputModel> {
    const { service_request_id, title, service_brief, contact_information, category } = input;
    const existent_service_request: ServiceRequestDTO = await this.gateway.findOne({ service_request_id });
    if (!existent_service_request)
      throw new NonExistentServiceRequestException();
    if (
      !isValidServiceRequestTitle(title)
      || !isValidServiceRequestServiceBrief(service_brief)
      || !isValidServiceRequestContactInformation(contact_information)
      || !isValidServiceRequestCategory(category)
    )
      throw new InvalidServiceRequestDetailsFormatException();
    return await this.gateway.update({
      ...input,
      applicants: existent_service_request.applicants,
      phase: existent_service_request.phase,
      service_provider: existent_service_request.service_provider
    });
  }
}
