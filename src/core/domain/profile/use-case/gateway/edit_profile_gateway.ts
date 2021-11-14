import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import PartialUpdate from '@core/common/persistence/partial_update';

export default interface EditProfileGateway extends PartialUpdate<ProfileDTO> {}
