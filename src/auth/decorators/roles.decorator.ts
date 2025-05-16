import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/enum';

export const ROLES_KEY = 'role';
export const Role = (...roles: Roles[]) => SetMetadata(ROLES_KEY, roles);
