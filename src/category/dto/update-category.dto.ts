import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Blog } from 'src/blog/schema/blog.schema';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  blogs: Blog[];
}
