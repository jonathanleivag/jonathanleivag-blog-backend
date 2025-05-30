import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { Roles } from 'src/enum';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
    example: 'JONATHAN',
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({
    description: 'email of the user',
    example: 'EMAIL@EMAIL.COM',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'PASSWORD',
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @ApiProperty({
    description: 'ConfirmPassword of the user',
    example: 'PASSWORD',
  })
  @IsString({ message: 'ConfirmPassword must be a string' })
  @MinLength(8, {
    message: 'ConfirmPassword must be at least 8 characters long',
  })
  @IsNotEmpty({ message: 'ConfirmPassword is required' })
  confirmPassword: string;

  @ApiProperty({
    description: 'Phone of the user',
    example: '+56912345678',
  })
  @Matches(/^(\+56)(9\d{8})$/, {
    message: 'Phone must be a valid Chilean mobile number',
  })
  phone: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'ADMIN',
  })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  role?: Roles;

  @ApiProperty({
    description: 'Brief description or bio of the user',
    example: 'Software developer with expertise in web technologies',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Location of the user',
    example: 'Chile',
  })
  @IsNotEmpty({ message: 'Location is required' })
  @IsString({ message: 'Location must be a string' })
  location: string;

  @IsDate({ message: 'Start must be a date' })
  @IsNotEmpty({ message: 'Start is required' })
  @Type(() => Date)
  start: Date;

  @ApiProperty({
    description: 'WebSite of the user',
    example: 'https://www.example.com',
  })
  @IsString({ message: 'WebSite must be a string' })
  @IsOptional()
  webSite: string;

  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsNotEmpty({ message: 'Image is required' })
  @ApiProperty({
    description: 'Image of the user',
    example: 'URL_ADDRESS.com/image.jpg',
  })
  avatar: string;

  @ApiProperty({
    description: 'IsActive of the user',
    example: true,
  })
  @IsBoolean({ message: 'IsActive must be a boolean' })
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  deletedAt?: Date;
}
