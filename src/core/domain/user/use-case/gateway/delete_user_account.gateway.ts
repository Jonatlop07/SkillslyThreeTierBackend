import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import Delete from '@core/common/persistence/delete';

export default interface DeleteUserAccountGateway extends Delete<UserQueryModel, UserDTO> {}
