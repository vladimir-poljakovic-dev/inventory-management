import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { Role } from '@repo/types';

export const ROLES_KEY = 'roles';

/**
 * Restricts a route to the given roles. Enforced by the global RolesGuard.
 * With no @Roles() decorator a route is open to any authenticated user.
 */
export const Roles = (...roles: Role[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
