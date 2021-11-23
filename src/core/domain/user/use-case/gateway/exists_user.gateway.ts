import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';

export default interface ExistsUsersGateway
  extends Exists<UserDTO> {}
