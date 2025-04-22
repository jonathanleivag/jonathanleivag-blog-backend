import {
  IsString,
  MinLength,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Roles } from 'src/enum';

export class CreateUserDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'ConfirmPassword must be a string' })
  @MinLength(8, {
    message: 'ConfirmPassword must be at least 8 characters long',
  })
  @IsNotEmpty({ message: 'ConfirmPassword is required' })
  confirmPassword: string;

  @IsPhoneNumber('CH', { message: 'Phone must be a valid phone number' })
  phone: string;

  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  @IsOptional()
  role?: Roles;

  @IsBoolean({ message: 'IsActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  @IsBoolean({ message: 'IsVerified must be a boolean' })
  @IsOptional()
  deletedAt?: Date;
}
