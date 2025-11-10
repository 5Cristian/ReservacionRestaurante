// backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from '../users/user.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VerificationCode } from './verification-code.entity';
import { PendingUser } from './pending-user.entity';
import { MailService } from '../mail/mail.service';

import { RegisterDto } from './dto/register.dto';
import { RegisterStartDto } from './dto/register-start.dto';
import { RegisterVerifyDto } from './dto/register-verify.dto';

const PENDING_TTL_HOURS = 24;

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    @InjectRepository(VerificationCode)
    private codesRepo: Repository<VerificationCode>,
    @InjectRepository(PendingUser)
    private pendingRepo: Repository<PendingUser>,
    private mail: MailService,
  ) {}

  // ---------- LOGIN ----------
  async login(username: string, password: string) {
    const user =
      (await this.users.findByEmail(username)) ||
      (await this.users.findByUsername(username));
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const access_token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: process.env.JWT_EXPIRES || '1d' },
    );

    return {
      access_token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  // ---------- GENERAR CÓDIGO ALEATORIO ----------
private generateCode(len = 6) {
  return Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
}

  // ---------- ENVIAR CÓDIGO ----------
async sendVerificationCode(email: string) {
  const code = this.generateCode(6);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

  try {
    await this.codesRepo.save({ email: email.toLowerCase(), code, expiresAt, used: false });
  } catch (e: any) {
    console.error('[codesRepo.save] error:', e?.code || e?.message, e);
    throw new InternalServerErrorException('No se pudo generar el código');
  }

  // Construye el enlace al front para verificar
  const base = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyUrl = `${base}/verify-email?email=${encodeURIComponent(email)}`;

  // En dev no rompas si el SMTP falla
  try {
    if (String(process.env.MAIL_ENABLED || 'true') === 'true') {
      // ← pasamos verifyUrl como 3er parámetro
      await this.mail.sendVerificationCode(email, code, verifyUrl);
    } else {
      console.log('[MAIL_DISABLED] Código para', email, '=>', code, 'URL:', verifyUrl);
    }
  } catch (e: any) {
    console.error('[mail.sendVerificationCode] error:', e?.message);
    // No lanzamos error aquí para evitar 500 en dev
  }
}


  // ---------- LEGACY: REGISTRO EN UN SOLO PASO ----------
  async registerCustomer(dto: RegisterDto) {
    if (!dto.email) throw new BadRequestException('Email requerido');

    const lastCode = await this.codesRepo.findOne({
      where: { email: dto.email.toLowerCase(), used: false },
      order: { createdAt: 'DESC' },
    });
    if (!lastCode) throw new BadRequestException('Primero solicita un código de verificación');
    if (lastCode.code !== dto.verificationCode) throw new BadRequestException('Código inválido');
    if (lastCode.expiresAt < new Date()) throw new BadRequestException('Código expirado');

    lastCode.used = true;
    await this.codesRepo.save(lastCode);

    const strong =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/.test(dto.password);
    if (!strong) throw new BadRequestException('La contraseña no cumple complejidad');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const created = await this.users.create({
      username: dto.username,
      name: dto.fullName,
      email: dto.email.toLowerCase(),
      phone: dto.phone ?? null,
      passwordHash,
      role: 'customer',
    });
    const user = Array.isArray(created) ? created[0] : created;

    const access_token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'changeme',
      { expiresIn: process.env.JWT_EXPIRES || '1d' },
    );

    return {
      access_token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  // ---------- NUEVO: REGISTRO PASO 1 ----------
  async registerStart(dto: RegisterStartDto) {
    if (!dto.username?.trim()) throw new BadRequestException('username requerido');
    if (!dto.fullName?.trim()) throw new BadRequestException('nombre requerido');
    if (!dto.email?.trim()) throw new BadRequestException('email requerido');
    if (!dto.password?.trim()) throw new BadRequestException('password requerido');

    const username = dto.username.trim().toLowerCase();
    const email = dto.email.trim().toLowerCase();
    const name = dto.fullName.trim();
    const phone = dto.phone ?? null;

    const strong =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/.test(dto.password);
    if (!strong) throw new BadRequestException('La contraseña no cumple complejidad');

    if (await this.users.findByUsername(username))
      throw new BadRequestException('El usuario ya existe');
    if (await this.users.findByEmail(email))
      throw new BadRequestException('El email ya está registrado');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const expiresAt = new Date(Date.now() + PENDING_TTL_HOURS * 3600_000);

    try {
      // Evita duplicados por email
      await this.pendingRepo.delete({ email });
      await this.pendingRepo.save({
        email,
        username,
        name,
        phone,
        passwordHash,
        expiresAt,
      });
    } catch (e: any) {
      console.error('[pendingRepo.save] error:', e?.code || e?.message, e);
      if (e?.code === '23505') {
        // Postgres: unique_violation
        throw new BadRequestException('Ya existe un registro pendiente para ese correo');
      }
      throw new InternalServerErrorException('No se pudo iniciar el registro');
    }

    // Genera + envía código (con tolerancia al fallo de SMTP)
    await this.sendVerificationCode(email);
    return { ok: true, message: 'Te enviamos un código a tu correo.' };
  }

  // ---------- NUEVO: REGISTRO PASO 2 ----------
async registerVerify(dto: RegisterVerifyDto) {
  // Normaliza y valida entrada
  const email = String(dto?.email ?? '').trim().toLowerCase();
  const code  = String(dto?.code  ?? '').trim();

  if (!email) throw new BadRequestException('Email requerido');
  if (!code)  throw new BadRequestException('Código requerido');

  const last = await this.codesRepo.findOne({
    where: { email, used: false },
    order: { createdAt: 'DESC' },
  });
  if (!last) throw new BadRequestException('Primero solicita un código');
  if (last.code !== code) throw new BadRequestException('Código inválido');
  if (last.expiresAt < new Date()) throw new BadRequestException('Código expirado');

  const pending = await this.pendingRepo.findOne({ where: { email } });
  if (!pending) throw new BadRequestException('Registro temporal no encontrado o expirado');
  if (pending.expiresAt < new Date()) {
    await this.pendingRepo.delete({ id: pending.id });
    throw new BadRequestException('Registro temporal expirado');
  }

  let user;
  try {
    const created = await this.users.create({
      username: pending.username,
      name: pending.name,
      email: pending.email,
      phone: pending.phone ?? null,
      passwordHash: pending.passwordHash,
      role: 'customer',
    });
    user = Array.isArray(created) ? created[0] : created;
  } catch (e: any) {
    console.error('[users.create] error:', e?.code || e?.message, e);
    throw new InternalServerErrorException('No se pudo finalizar el registro');
  }

  last.used = true;
  await this.codesRepo.save(last);
  await this.pendingRepo.delete({ id: pending.id });

  const access_token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET || 'changeme',
    { expiresIn: process.env.JWT_EXPIRES || '1d' },
  );

  return {
    access_token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}
}





