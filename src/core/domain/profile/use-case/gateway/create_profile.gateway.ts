import Create from '@core/common/persistence/create';
import { Profile } from '@core/domain/profile/entity/profile';

export default interface CreateProfileGateway
  extends Create<Profile> {
}
