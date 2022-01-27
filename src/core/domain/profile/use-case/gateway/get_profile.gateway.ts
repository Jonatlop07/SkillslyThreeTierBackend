import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import Find from '@core/common/persistence/find';
import { ProfileQueryModel } from '@core/domain/profile/use-case/query-model/profile.query_model';

export default interface GetProfileGateway extends Find<ProfileDTO, ProfileQueryModel> {
}
