import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';

export default interface ProfileRepository
  extends CreateProfileGateway, GetProfileGateway {
}
