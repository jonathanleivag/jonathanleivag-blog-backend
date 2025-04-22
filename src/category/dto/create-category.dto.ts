import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(3, { message: 'Description must be at least 3 characters long' })
  description: string;

  @IsBoolean({ message: 'IsActive must be a boolean' })
  @IsOptional()
  isActive: boolean;

  @IsDate({ message: 'DeletedAt must be a date' })
  @IsOptional()
  deletedAt: Date;
}
