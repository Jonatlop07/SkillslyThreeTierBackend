import Find from '@core/common/persistence/find';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';

export default interface ValidateCredentialsGateway extends Find<UserDTO, UserQueryModel> {}
