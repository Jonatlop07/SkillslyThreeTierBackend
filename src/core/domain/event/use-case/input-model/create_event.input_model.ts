import { Id } from '@core/common/type/common_types';

export default interface CreateEventInputModel {
  name: string;
  description: string;
  lat: number;
  long: number;
  date: Date;
  user_id: Id;
}
