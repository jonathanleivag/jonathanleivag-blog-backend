import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Blog } from 'src/blog/schema/blog.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Blogs of the category',
    example: [
      '68087769fd85a80341553840',
      '68087769fd85a80341553840',
      '68087769fd85a80341553840',
    ],
  })
  blogs: Blog[];
}
