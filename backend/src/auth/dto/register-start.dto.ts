import { IsEmail, IsOptional, IsString, Matches, MinLength } from 'class-validator';

export class RegisterStartDto {
  @IsString()
  username!: string;

  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#._-]).+$/, {
    message: 'La contraseña no cumple complejidad',
  })
  password!: string;
}


