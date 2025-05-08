import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Roles } from 'src/enum';
import { CategoryDocument } from './schema/category.schema';
import { ApiBearerAuth } from '@nestjs/swagger';
import normalizeSearch from '../utils/normalizeSearch.util';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  @ApiBearerAuth('bearer')
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
  @ApiBearerAuth('bearer')
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
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('search') search?: string,
    @Query('isActive') isActive?: string,
  ): Promise<any> {
    const isPublished =
      published === 'true' ? true : published === 'false' ? false : undefined;

    const isPopular =
      popular === 'true' ? true : popular === 'false' ? false : undefined;

    const isActiveBoolean =
      isActive === 'true' ? true : isActive === 'false' ? false : undefined;

    const isSearch = normalizeSearch(search);

    return this.categoryService.categoryByBlogs(
      isPublished,
      isPopular,
      parseInt(page),
      parseInt(limit),
      isSearch,
      isActiveBoolean,
    );
  }
}
