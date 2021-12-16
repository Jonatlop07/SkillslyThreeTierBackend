import { JoinRequestDTO } from '../../persistence-dto/join_request.dto';

export default interface GetJoinRequestsOutputModel {
  joinRequests: JoinRequestDTO[]; 
}