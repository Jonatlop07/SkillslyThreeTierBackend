import { Role } from '@core/domain/user/entity/type/role.enum';
import { UpdateUserRolesDTO } from '@core/domain/user/use-case/persistence-dto/update_user_roles.dto';

export default interface ObtainSpecialRolesPersistenceGateway {
  updateUserRoles(user_roles: UpdateUserRolesDTO): Promise<Array<Role>>;
}
