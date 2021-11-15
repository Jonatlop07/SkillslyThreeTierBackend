import Find from '@core/common/persistence/find';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '../query-model/user.query_model';

export default interface SearchUsersGateway
  extends Find<UserDTO, UserQueryModel> {}
