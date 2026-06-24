import { IsEmail, IsString, MinLength } from 'class-validator';
import { Role } from '../enums/role.enum';

/**
 * Payload for `POST /auth/register`.
 * Validated by the API's global ValidationPipe via these class-validator decorators.
 */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

/**
 * Payload for `POST /auth/login`.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

/**
 * Shape returned by both `register` and `login`.
 * Never includes the user's password.
 */
export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    role: Role;
  };
}
