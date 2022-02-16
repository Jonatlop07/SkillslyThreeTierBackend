import Exists from '@core/common/persistence/exists/exists';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
export default interface ExistsUsersGateway
  extends Exists<UserQueryModel> {}
