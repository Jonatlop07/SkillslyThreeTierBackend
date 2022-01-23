import { Role } from '@core/domain/user/entity/type/role.enum';

export default interface ObtainSpecialRolesOutputModel {
  roles: Array<Role>;
}
