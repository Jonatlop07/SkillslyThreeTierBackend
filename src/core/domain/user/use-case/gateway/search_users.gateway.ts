import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '../query-model/user.query_model';
import FindOne from '@core/common/persistence/find_one';
import FindAll from '@core/common/persistence/find_all';

export default interface SearchUsersGateway
  extends FindOne<UserQueryModel, UserDTO>, FindAll<UserQueryModel, UserDTO>  {}
