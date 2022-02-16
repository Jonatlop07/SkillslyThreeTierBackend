import Create from '@core/common/persistence/create/create';
import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import CreateUserAccountPersistenceDTO
  from '@core/domain/user/use-case/persistence-dto/create_user_account.persistence_dto';

export default interface CreateUserAccountGateway
  extends Create<CreateUserAccountPersistenceDTO, UserDTO>, Exists<UserDTO> {}
