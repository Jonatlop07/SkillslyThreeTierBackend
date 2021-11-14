import Update from '@core/common/persistence/update';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import Find from '@core/common/persistence/find';

export default interface UpdateUserAccountGateway extends Update<UserDTO>, Find<UserDTO> {}
