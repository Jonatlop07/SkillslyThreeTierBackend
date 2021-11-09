import Get from '@core/common/persistence/get';
import { Profile } from '@core/domain/profile/entity/profile';

export default interface GetProfileGateway
  extends Get<Profile> {
}
