import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as public so the global JwtAuthGuard skips authentication.
 * Routes are protected by default — opt out explicitly with @Public().
 */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true);
