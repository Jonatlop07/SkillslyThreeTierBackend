import { SetMetadata } from '@nestjs/common';
import { Role } from '@core/domain/user/entity/role.enum';

export const ROLES_KEY: unique symbol = Symbol('roles');
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
