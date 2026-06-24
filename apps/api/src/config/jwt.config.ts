import { ConfigService } from '@nestjs/config';
import type { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';

/**
 * Factory for JwtModule.registerAsync. Signs tokens with JWT_SECRET and the
 * JWT_EXPIRES_IN lifetime (e.g. "7d") from the environment.
 */
export const jwtConfig = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get<string>('JWT_SECRET'),
  signOptions: {
    // JWT_EXPIRES_IN is a duration string; cast to jsonwebtoken's expiresIn type.
    expiresIn: config.get<string>('JWT_EXPIRES_IN') as JwtSignOptions['expiresIn'],
  },
});
