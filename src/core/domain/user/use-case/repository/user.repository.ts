import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import ValidateCredentialsGateway from '../gateway/validate_credentials.gateway';
import UpdateUserAccountGateway from '@core/domain/user/use-case/gateway/update_user_account.gateway';
import QueryUserAccountGateway from '@core/domain/user/use-case/gateway/query_user_account.gateway';
import DeleteUserAccountGateway from '@core/domain/user/use-case/gateway/delete_user_account.gateway';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import CreateUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/create_user_follow_request.gateway';
import DeleteUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/delete_user_follow_request.gateway';
import UpdateUserFollowRequestGateway from '@core/domain/user/use-case/gateway/follow_request/update_user_follow_request.gateway';
import GetUserFollowRequestCollectionGateway from '@core/domain/user/use-case/gateway/follow_request/get_user_follow_request.gateway';
import { AddCustomerDetailsGateway } from '@core/domain/user/use-case/gateway/add_customer_details.gateway';
import ObtainSpecialRolesPersistenceGateway
  from '@core/domain/user/use-case/gateway/obtain_special_roles_persistence.gateway';
import TwoFactorAuthGateway from '@core/domain/user/use-case/gateway/two_factor_auth.gateway';
import RequestResetPassword from "@core/domain/user/use-case/gateway/request_reset_passwrod.gateway";
import ResetPassword from "@core/domain/user/use-case/gateway/reset_password.gateway";

export default interface UserRepository
  extends CreateUserAccountGateway, ValidateCredentialsGateway,
  UpdateUserAccountGateway, QueryUserAccountGateway, DeleteUserAccountGateway,
  SearchUsersGateway, CreateUserFollowRequestGateway, UpdateUserFollowRequestGateway,
  DeleteUserFollowRequestGateway, GetUserFollowRequestCollectionGateway,
  AddCustomerDetailsGateway, ObtainSpecialRolesPersistenceGateway,
  TwoFactorAuthGateway, RequestResetPassword , ResetPassword {}
