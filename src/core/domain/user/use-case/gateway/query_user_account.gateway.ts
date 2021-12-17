import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import Find from '@core/common/persistence/find';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';

export default interface QueryUserAccountGateway extends Find<UserDTO, UserQueryModel> {}
