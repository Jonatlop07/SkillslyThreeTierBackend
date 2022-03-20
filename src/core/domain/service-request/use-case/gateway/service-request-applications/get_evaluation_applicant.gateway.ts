import { ServiceRequestDTO } from '../../persistence-dto/service_request.dto';
import GetServiceRequestEvaluationApplicant from '../../persistence/service-request-applications/get_evaluation_applicant';
import ServiceRequestQueryModel from '../../query-model/service_request.query_model';
import FindOne from '@core/common/persistence/find_one';

export default interface GetServiceRequestEvaluationApplicantGateway
  extends GetServiceRequestEvaluationApplicant, FindOne<ServiceRequestQueryModel, ServiceRequestDTO>{}
