import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'CATEGORY',
  })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @ApiProperty({
    description: 'Description of the category',
    example: 'DESCRIPTION',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(3, { message: 'Description must be at least 3 characters long' })
  description: string;

  @ApiProperty({
    description: 'IsActive of the category',
    example: true,
  })
  @IsBoolean({ message: 'IsActive must be a boolean' })
  @IsOptional()
  isActive: boolean;

  @ApiProperty({
    description: 'CreatedAt of the category',
    example: new Date(),
  })
  @IsDate({ message: 'DeletedAt must be a date' })
  @IsOptional()
  deletedAt: Date;
}
