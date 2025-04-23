import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/enum';
import { CategoryDocument } from './schema/category.schema';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CategoryDocument> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Get('find/blogs')
  categoryByBlogs(
    @Query('published') published?: string,
    @Query('popular') popular?: string,
  ): Promise<CategoryDocument[]> {
    const isPublished =
      published === 'true' ? true : published === 'false' ? false : undefined;

    const isPopular =
      popular === 'true' ? true : popular === 'false' ? false : undefined;

    return this.categoryService.categoryByBlogs(isPublished, isPopular);
  }
}
