import { Role } from '../enums/role.enum';

/**
 * Decoded JWT contents. `sub` holds the user's id (JWT standard claim).
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
