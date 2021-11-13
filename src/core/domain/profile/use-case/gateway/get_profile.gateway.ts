import Get from '@core/common/persistence/get';
import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';

export default interface GetProfileGateway extends Get<ProfileDTO> {}
