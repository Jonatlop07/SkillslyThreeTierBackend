import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import PartialUpdate from '@core/common/persistence/partial_update';
import { ProfileQueryModel } from '@core/domain/profile/use-case/query-model/profile.query_model';
import FindOne from '@core/common/persistence/find/find_one';

export default interface EditProfileGateway extends PartialUpdate<ProfileDTO>,
  FindOne<ProfileQueryModel, ProfileDTO> {}
