import Query from '@core/common/persistence/query';
import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';

export default interface QueryUserAccountGateway extends Query<UserDTO> {}
