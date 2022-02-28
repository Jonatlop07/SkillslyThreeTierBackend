import { Id } from '@core/common/type/common_types';

export default interface CreateProfileOutputModel {
  user_id: Id
  resume: string,
  knowledge: Array<string>,
  talents: Array<string>,
  activities: Array<string>,
  interests: Array<string>,
}
