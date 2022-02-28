import { Role } from '@core/domain/user/entity/type/role.enum';

export default interface CreateUserAccountPersistenceDTO {
  email: string;
  password: string;
  name: string;
  date_of_birth: string;
  is_investor: boolean;
  is_requester: boolean;
  roles: Array<Role>;
}
