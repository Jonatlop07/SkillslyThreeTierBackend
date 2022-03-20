import Create from '@core/common/persistence/create';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import CreateUserAccountPersistenceDTO
  from '@core/domain/user/use-case/persistence-dto/create_user_account.persistence_dto';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import Exists from '@core/common/persistence/exists';

export default interface CreateUserAccountGateway
  extends Create<CreateUserAccountPersistenceDTO, UserDTO>, Exists<UserQueryModel> {}
