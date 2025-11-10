// users/dto/create-user.dto.ts
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString() name: string;
  @IsString() username: string;

  @IsOptional()
  @IsEmail()
  email?: string | null;

  @IsIn(['admin','staff'])
  role: 'admin' | 'staff';

  @IsString()
  @MinLength(6)
  password: string;
}
