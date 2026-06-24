import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@repo/types';
import { ROLES_KEY } from '../decorators/roles.decorator';

interface RequestWithUser {
  user?: { role?: Role };
}

/**
 * Global guard that enforces @Roles(). Routes without the decorator are
 * allowed for any authenticated user.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    return !!user?.role && requiredRoles.includes(user.role);
  }
}
