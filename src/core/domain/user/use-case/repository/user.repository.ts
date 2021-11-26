import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import ValidateCredentialsGateway from '../gateway/validate_credentials.gateway';
import UpdateUserAccountGateway from '@core/domain/user/use-case/gateway/update_user_account.gateway';
import QueryUserAccountGateway from '@core/domain/user/use-case/gateway/query_user_account.gateway';
import DeleteUserAccountGateway from '@core/domain/user/use-case/gateway/delete_user_account.gateway';
import SearchUsersGateway from '@core/domain/user/use-case/gateway/search_users.gateway';
import CreateUserFollowRequestGateway from '@core/domain/user/use-case/gateway/create_user_follow_request.gateway';

export default interface UserRepository
  extends CreateUserAccountGateway, ValidateCredentialsGateway,
  UpdateUserAccountGateway, QueryUserAccountGateway, DeleteUserAccountGateway,
  SearchUsersGateway, CreateUserFollowRequestGateway {}
