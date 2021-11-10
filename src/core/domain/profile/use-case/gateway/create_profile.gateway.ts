import Create from '@core/common/persistence/create';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';

export default interface CreateProfileGateway
  extends Create<ProfileDTO> {
}
