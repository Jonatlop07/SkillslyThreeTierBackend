import { UserDTO } from '@core/domain/user/use-case/persistence-dto/user.dto';
import UserQueryModel from '@core/domain/user/use-case/query-model/user.query_model';
import { PartialUpdateByParams } from '@core/common/persistence/partial_update_by_params';
import { PartialUserUpdateDTO } from '@core/domain/user/use-case/persistence-dto/partial_user_update.dto';
import FindOne from '@core/common/persistence/find/find_one';

export default interface TwoFactorAuthGateway
  extends FindOne<UserQueryModel, UserDTO>, PartialUpdateByParams<UserDTO, PartialUserUpdateDTO, UserQueryModel> {}
