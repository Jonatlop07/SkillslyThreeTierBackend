import CreateProfileGateway from '@core/domain/profile/use-case/gateway/create_profile.gateway';
import GetProfileGateway from '@core/domain/profile/use-case/gateway/get_profile.gateway';
import EditProfileGateway from '@core/domain/profile/use-case/gateway/edit_profile_gateway';

export default interface ProfileRepository
  extends CreateProfileGateway, GetProfileGateway, EditProfileGateway {}
