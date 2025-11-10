  // src/auth/auth.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { RegisterStartDto } from './dto/register-start.dto';
import { RegisterVerifyDto } from './dto/register-verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  login(@Body() body: { username: string; password: string }) {
    return this.auth.login(body.username, body.password);
  }

  @Post('send-code')
  sendCode(@Body() dto: SendCodeDto) {
    return this.auth.sendVerificationCode(dto.email);
  }

  // Legacy: registro en un paso
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.registerCustomer(dto);
  }

  // Paso 1: guarda pending_user + envía código
  @Post('register-start')
  registerStart(@Body() dto: RegisterStartDto) {
    return this.auth.registerStart(dto);
  }

  // Paso 2: verifica código y crea usuario
  @Post('register-verify')
  registerVerify(@Body() dto: RegisterVerifyDto) {
    return this.auth.registerVerify(dto);
  }
}




