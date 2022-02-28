import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface QueryUserAccountGateway extends FindOne<UserQueryModel, UserDTO> {}
