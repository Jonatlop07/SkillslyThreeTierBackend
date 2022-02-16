import { ProfileDTO } from '@core/domain/profile/use-case/persistence-dto/profile.dto';

export default interface GetProfileOutputModel {
  profile: ProfileDTO
}
