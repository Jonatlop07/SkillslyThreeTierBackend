import { PaginationDTO } from '@core/common/persistence/pagination.dto';
import { BasicGroupDTO } from '../persistence-dto/basic_group_data.dto';

export default interface FindGroups {
  findUserGroups(user_id: string, pagination: PaginationDTO): Promise<Array<BasicGroupDTO>>;
  findWithName(name: string, pagination: PaginationDTO): Promise<Array<BasicGroupDTO>>;
  findbyCategory(category: string, pagination: PaginationDTO): Promise<Array<BasicGroupDTO>>;
}
