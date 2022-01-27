import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';
import Find from '@core/common/persistence/find';
import GetProfileInputModel from '@core/domain/profile/use-case/input-model/get_profile.input_model';

export default interface GetProfileGateway extends Find<ProfileDTO, GetProfileInputModel> {
}
