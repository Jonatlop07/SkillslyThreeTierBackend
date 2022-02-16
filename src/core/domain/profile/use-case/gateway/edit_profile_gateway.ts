import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import PartialUpdate from '@core/common/persistence/partial_update';
import Find from '@core/common/persistence/find';
import { ProfileQueryModel } from '@core/domain/profile/use-case/query-model/profile.query_model';

export default interface EditProfileGateway extends PartialUpdate<ProfileDTO>, Find<ProfileDTO, ProfileQueryModel> {}
