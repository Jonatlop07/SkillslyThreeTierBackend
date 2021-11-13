import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import Update from '@core/common/persistence/update';

export default interface EditProfileGateway extends Update<ProfileDTO> {
}