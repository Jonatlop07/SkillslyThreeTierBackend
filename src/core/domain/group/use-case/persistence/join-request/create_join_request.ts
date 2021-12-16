import { JoinRequestDTO } from '../../persistence-dto/join_request.dto';

export default interface CreateJoinRequest{
  createJoinRequest(params: JoinRequestDTO): Promise<JoinRequestDTO>;
}
