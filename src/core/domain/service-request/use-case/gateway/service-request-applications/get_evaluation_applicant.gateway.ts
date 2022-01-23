import Find from '@core/common/persistence/find';
import { ServiceRequestDTO } from '../../persistence-dto/service_request.dto';
import GetServiceRequestEvaluationApplicant from '../../persistence/service-request-applications/get_evaluation_applicant';
import ServiceRequestQueryModel from '../../query-model/service_request.query_model';

export default interface GetServiceRequestEvaluationApplicantGateway
  extends GetServiceRequestEvaluationApplicant, Find<ServiceRequestDTO, ServiceRequestQueryModel>{}