import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Title of the blog',
    example: 'mi first blog en nestjs',
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Content of the blog',
    example: 'This is the content of my blog',
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  content: string;

  @ApiProperty({
    description: 'Description of the blog',
    example: 'This is the description of my blog',
  })
  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @ApiProperty({
    description: 'Image of the blog',
    example: 'URL_ADDRESS.com/image.jpg',
  })
  @IsUrl({}, { message: 'Image must be a valid URL' })
  @IsNotEmpty({ message: 'Image is required' })
  image: string;

  @ApiProperty({
    description: 'Published status of the blog',
    example: true,
  })
  @IsBoolean({ message: 'Published status must be a boolean' })
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    description: 'Slug of the blog',
    example: 'mi-first-blog-en-nestjs',
  })
  @IsString({ message: 'Slug must be a string' })
  @IsNotEmpty({ message: 'Slug is required' })
  slug: string;

  @ApiProperty({
    description: 'Tags of the blog',
    example: ['nestjs', 'typescript', 'javascript'],
  })
  @IsArray({ message: 'Tags must be an array of strings' })
  @IsString({
    each: true,
    message: 'Each tag must be a string',
  })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Views of the blog',
    example: 100,
  })
  @IsNumber({}, { message: 'Views must be a number' })
  @Min(0, { message: 'Views cannot be negative' })
  @IsOptional()
  views?: number;

  @ApiProperty({
    description: 'Reading time of the blog',
    example: 10,
  })
  @IsNumber({}, { message: 'Reading time must be a number' })
  @Min(0, { message: 'Reading time cannot be negative' })
  @IsOptional()
  readingTime?: number;

  @ApiProperty({
    description: 'Popular status of the blog',
    example: true,
  })
  @IsBoolean({ message: 'Popular status must be a boolean' })
  @IsOptional()
  popular?: boolean;

  @ApiProperty({
    description: 'User ID of the blog',
    example: '68087769fd85a80341553840',
  })
  @IsMongoId({ message: 'User ID must be a valid MongoID' })
  @IsNotEmpty({ message: 'User is required' })
  user: string;

  @ApiProperty({
    description: 'Category ID of the blog',
    example: '68087769fd85a80341553840',
  })
  @IsMongoId({ message: 'Category ID must be a valid MongoID' })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;
}
