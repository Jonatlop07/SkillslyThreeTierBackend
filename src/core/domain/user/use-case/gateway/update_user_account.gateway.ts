import Update from '@core/common/persistence/update';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export default interface UpdateUserAccountGateway extends Update<UserDTO>{}
