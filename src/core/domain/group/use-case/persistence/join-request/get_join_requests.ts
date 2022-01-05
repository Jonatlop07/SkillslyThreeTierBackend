import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import { JoinRequestDTO } from '../../persistence-dto/join_request.dto';
export default interface GetJoinRequests{
  getJoinRequests(group_id: string, pagination: PaginationDTO): Promise<Array<JoinRequestDTO>>;
}
