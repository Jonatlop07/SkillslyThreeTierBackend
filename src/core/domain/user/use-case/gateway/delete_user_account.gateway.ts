import Delete from '@core/common/persistence/delete';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export default interface DeleteUserAccountGateway extends Delete<UserDTO, string> {}
