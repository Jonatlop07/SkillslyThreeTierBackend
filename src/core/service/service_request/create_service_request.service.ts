import { Inject, Logger } from '@nestjs/common';
import { CreateServiceRequestInteractor } from '@core/domain/service-request/use-case/interactor/create_service_request.interactor';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import CreateServiceRequestGateway from '@core/domain/service-request/use-case/gateway/create_service_request.gateway';
import CreateServiceRequestInputModel
  from '@core/domain/service-request/use-case/input-model/create_service_request.input_model';
import CreateServiceRequestOutputModel
  from '@core/domain/service-request/use-case/output-model/create_service_request.output_model';
import {
  isValidServiceRequestCategory,
  isValidServiceRequestContactInformation,
  isValidServiceRequestServiceBrief,
  isValidServiceRequestTitle
} from '@core/common/util/validators/service_request_validators';
import { InvalidServiceRequestDetailsFormatException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import { ServiceRequestPhase } from '@core/domain/service-request/entity/type/service_request_phase.enum';

export class CreateServiceRequestService implements CreateServiceRequestInteractor {
  private readonly logger: Logger = new Logger(CreateServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: CreateServiceRequestGateway
  ) {}

  public async execute(input: CreateServiceRequestInputModel): Promise<CreateServiceRequestOutputModel> {
    const { requester_id, title, service_brief, contact_information, category } = input;
    if (
      !isValidServiceRequestTitle(title)
      || !isValidServiceRequestServiceBrief(service_brief)
      || !isValidServiceRequestContactInformation(contact_information)
      || !isValidServiceRequestCategory(category)
    )
      throw new InvalidServiceRequestDetailsFormatException();
    return await this.gateway.create({
      owner_id: requester_id,
      title,
      service_brief,
      contact_information,
      category,
      service_provider: null,
      applicants: [],
      phase: ServiceRequestPhase.Open
    });
  }
}
