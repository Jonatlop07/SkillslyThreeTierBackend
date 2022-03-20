import { Id } from '@core/common/type/common_types';

export type CreateUserEntityPayload = {
  email: string,
  password: string,
  id?: Id,
  name: string,
  date_of_birth: string
};
