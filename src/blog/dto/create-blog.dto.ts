import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  IsMongoId,
  IsUrl,
} from 'class-validator';

export class CreateBlogDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @IsBoolean({ message: 'Published status must be a boolean' })
  @IsOptional()
  published?: boolean;

  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string;

  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({
    each: true,
    message: 'Each tag must be a string',
  })
  @IsOptional()
  tags?: string[];

  @IsNumber({}, { message: 'Views must be a number' })
  @Min(0, { message: 'Views cannot be negative' })
  @IsOptional()
  views?: number;

  @IsNumber({}, { message: 'Reading time must be a number' })
  @Min(0, { message: 'Reading time cannot be negative' })
  @IsOptional()
  readingTime?: number;

  @IsBoolean({ message: 'Popular status must be a boolean' })
  @IsOptional()
  popular?: boolean;

  @IsMongoId({ message: 'User ID must be a valid MongoID' })
  @IsNotEmpty({ message: 'User is required' })
  user: string;

  @IsMongoId({ message: 'Category ID must be a valid MongoID' })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;
}
