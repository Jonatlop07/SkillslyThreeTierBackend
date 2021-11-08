import CreateUserAccountGateway from '@core/domain/user/use-case/gateway/create_user_account.gateway';
import ValidateCredentialsGateway from './gateway/validate_credentials.gateway';

export default interface UserRepository
  extends CreateUserAccountGateway, ValidateCredentialsGateway {}
