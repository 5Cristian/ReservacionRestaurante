import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { VerificationCode } from './verification-code.entity';
import { PendingUser } from './pending-user.entity';
import { MailModule } from '../mail/mail.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    MailModule,
    TypeOrmModule.forFeature([VerificationCode, PendingUser]),
    // registra passport con estrategia por defecto 'jwt'
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // registra JWT con tu secreto y expiración
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'changeme',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // <<-- registra la estrategia
  exports: [AuthService, PassportModule, JwtModule], // <<-- exporta si otros módulos la usan
})
export class AuthModule {}


