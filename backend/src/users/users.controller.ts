import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';

type CreateUserDto = {
  name: string;
  username: string;
  email?: string | null;
  role?: 'admin' | 'staff' | 'customer';
  password: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.users.create({
      name: dto.name,
      username: dto.username,
      email: dto.email ?? null,
      role: dto.role ?? 'staff', // alta interna por defecto staff
      password: dto.password,
    });
  }
}
