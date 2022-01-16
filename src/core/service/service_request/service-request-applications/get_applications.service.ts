import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestService } from '../create_service_request.service';
import { NonExistentServiceRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import GetServiceRequestApplicationsOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/get_applications.output_model';
import GetServiceRequestApplicationsInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/get_applications.input_model';
import { GetServiceRequestApplicationsInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/get_applications.interactor';
import GetServiceRequestApplicationsGateway from '@core/domain/service-request/use-case/gateway/service-request-applications/get_applications.gateway';

export class GetServiceRequestApplicationsService implements GetServiceRequestApplicationsInteractor {
  private readonly logger: Logger = new Logger(CreateServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: GetServiceRequestApplicationsGateway
  ) {}

  public async execute(input: GetServiceRequestApplicationsInputModel): Promise<GetServiceRequestApplicationsOutputModel> {
    const {  request_id, } = input;
    const existing_request = await this.gateway.findOne({ service_request_id: request_id });
    if (!existing_request){
      throw new NonExistentServiceRequestException();
    }
    return {
      applications: await this.gateway.getApplications(request_id)
    };
  }
}
