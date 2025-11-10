// backend/src/auth/dto/register.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty()
  username: string;

  @IsString() @IsNotEmpty()
  fullName: string; // <-- si tu entidad es "name", en el servicio mapeamos

  @IsEmail()
  email: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsString() @MinLength(8)
  password: string;

  @IsString() @MinLength(4)
  verificationCode: string;
}

