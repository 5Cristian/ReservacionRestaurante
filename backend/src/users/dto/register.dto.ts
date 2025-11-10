// backend/src/auth/dto/register.dto.ts
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username?: string;  // opcional: lo generamos si no viene

  @IsString()
  @MinLength(6)
  password: string;
}
