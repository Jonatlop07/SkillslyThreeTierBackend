import { Inject, Logger } from '@nestjs/common';
import { ServiceRequestDITokens } from '@core/domain/service-request/di/service_request_di_tokens';
import { CreateServiceRequestService } from '../create_service_request.service';
import { NonExistentServiceRequestException } from '@core/domain/service-request/use-case/exception/service_request.exception';
import GetServiceRequestEvaluationApplicantGateway from '@core/domain/service-request/use-case/gateway/service-request-applications/get_evaluation_applicant.gateway';
import { GetServiceRequestEvaluationApplicantInteractor } from '@core/domain/service-request/use-case/interactor/service-request-applications/get_evaluation_applicant.interactor';
import GetServiceRequestEvaluationApplicantInputModel from '@core/domain/service-request/use-case/input-model/service-request-applications/get_evaluation_applicant.input_model';
import GetServiceRequestEvaluationApplicantOutputModel from '@core/domain/service-request/use-case/output-model/service-request-applications/get_evaluation_applicant.output_model';

export class GetServiceRequestEvaluationApplicantService implements GetServiceRequestEvaluationApplicantInteractor {
  private readonly logger: Logger = new Logger(CreateServiceRequestService.name);

  constructor(
    @Inject(ServiceRequestDITokens.ServiceRequestRepository)
    private readonly gateway: GetServiceRequestEvaluationApplicantGateway
  ) {}

  public async execute(input: GetServiceRequestEvaluationApplicantInputModel): Promise<GetServiceRequestEvaluationApplicantOutputModel> {
    const {  request_id, } = input;
    const existing_request = await this.gateway.findOne({ service_request_id: request_id });
    if (!existing_request){
      throw new NonExistentServiceRequestException();
    }
    const applicant = await this.gateway.getEvaluationApplicant(request_id);
    if (!applicant){
      return null;
    }
    return {
      applicant_email: applicant.applicant_email,
      applicant_name: applicant.applicant_name,
      applicant_id: applicant.applicant_id, 
      request_phase: applicant.request_phase 
    };
  }
}
