import ServiceRequestQueryModel from '../../query-model/service_request.query_model';

export default interface ExistsApplicationOrRequests{
  existsApplication(params: ServiceRequestQueryModel): Promise<boolean>;
}
