import { JoinRequestDTO } from '../../persistence-dto/join_request.dto';

export default interface DeleteJoinRequest{
  deleteJoinRequest(params: JoinRequestDTO): Promise<JoinRequestDTO>;
}
