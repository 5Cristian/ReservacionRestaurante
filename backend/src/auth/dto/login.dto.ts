// backend/src/auth/dto/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString() @IsNotEmpty()
  username: string;  // puede ser email o username

  @IsString() @IsNotEmpty()
  password: string;
}


