import { Id } from '@core/common/type/common_types';

export default interface EditProfileInputModel {
  resume: string,
  knowledge: Array<string>,
  talents: Array<string>,
  activities: Array<string>,
  interests: Array<string>,
  user_id?: Id;
}
