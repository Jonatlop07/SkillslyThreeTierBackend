import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import { ProfileQueryModel } from '@core/domain/profile/use-case/query-model/profile.query_model';
import FindOne from '@core/common/persistence/find_one';

export default interface GetProfileGateway extends FindOne<ProfileQueryModel, ProfileDTO> {
}
