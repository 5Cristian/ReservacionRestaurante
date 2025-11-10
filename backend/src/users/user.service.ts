// backend/src/users/user.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

export type UserRole = 'admin' | 'customer' | 'staff';

type CreateUserInput = {
  username: string;
  name: string;                  // <-- mapea desde dto.fullName
  email?: string | null;
  phone?: string | null;
  role?: UserRole;
  password?: string;
  passwordHash?: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }
  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }
  async findByIdentifier(identifier: string) {
    if (!identifier) return null;
    return identifier.includes('@') ? this.findByEmail(identifier) : this.findByUsername(identifier);
  }
  async findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async create(input: CreateUserInput) {
    if (!input.username?.trim()) throw new BadRequestException('username requerido');
    if (!input.name?.trim()) throw new BadRequestException('name requerido');
    if (!input.password && !input.passwordHash) throw new BadRequestException('password requerido');

    const uname = input.username.trim().toLowerCase();
    const existsU = await this.repo.findOne({ where: { username: uname } });
    if (existsU) throw new BadRequestException('El usuario ya existe');

    let email: string | null = input.email ?? null;
    if (email) {
      email = email.trim().toLowerCase();
      const existsE = await this.repo.findOne({ where: { email } });
      if (existsE) throw new BadRequestException('El email ya está registrado');
    }

    const passwordHash = input.passwordHash ?? await bcrypt.hash(input.password!, 10);

const user = this.repo.create({
  username: uname,
  email,
  phone: input.phone ?? null,
  passwordHash,
  role: (input.role ?? ('customer' as any)) as any,

  name: (input as any).name ? input.name.trim() : undefined,
  fullName: (input as any).name ? undefined : input.name.trim(),
} as any);

return this.repo.save(user);
  }

  async createAdminIfMissing() {
    const adminExists = await this.repo.findOne({ where: { role: 'admin' as any } });
    if (adminExists) return { created: false, id: adminExists.id };

    const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const email    = process.env.ADMIN_EMAIL?.toLowerCase() || null;
    const name     = process.env.ADMIN_NAME || 'Administrador';
    const pass     = process.env.ADMIN_PASSWORD || 'Admin123!';

    if (await this.findByUsername(username)) return { created: false, reason: 'username ya existe' };
    if (email && await this.findByEmail(email)) return { created: false, reason: 'email ya existe' };

    const passwordHash = await bcrypt.hash(pass, 10);

    const admin = this.repo.create({ username, email, name, passwordHash, role: 'admin' });
    const saved = await this.repo.save(admin);
    return { created: true, id: saved.id };
  }

  async updatePassword(userId: number, newPassword: string) {
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException('Usuario no encontrado');
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.repo.save(user);
    return { ok: true };
  }
}

