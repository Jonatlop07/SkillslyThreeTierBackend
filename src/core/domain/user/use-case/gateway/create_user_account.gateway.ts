import Create from '@core/common/persistence/create';
import Exists from '@core/common/persistence/exists';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export default interface CreateUserAccountGateway extends Create<UserDTO>, Exists<UserDTO> {}
