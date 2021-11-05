import Create from '@core/common/persistence/create';
import { User } from '@core/domain/user/entity/user';
import Exists from '@core/common/persistence/exists';

export default interface CreateUserAccountGateway
  extends Create<User>, Exists<User> {
}
