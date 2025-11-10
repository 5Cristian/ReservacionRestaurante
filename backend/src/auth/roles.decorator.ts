import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ('admin'|'staff')[]) => SetMetadata(ROLES_KEY, roles);
