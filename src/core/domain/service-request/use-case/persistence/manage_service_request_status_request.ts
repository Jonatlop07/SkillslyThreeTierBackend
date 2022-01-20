import { UpdateRequestDTO } from '../persistence-dto/service_request_update_request.dto';

export default interface ManageStatusRequests {
  existsRequest(params: UpdateRequestDTO): Promise<boolean>;
  createCompleteRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO>;
  createCancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO>;
  completeRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO>;
  cancelRequest(params: UpdateRequestDTO): Promise<UpdateRequestDTO>;
}
