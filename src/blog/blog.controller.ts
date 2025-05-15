import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogDocument } from './schema/blog.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/enum';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../auth/decorators/user.decorator';
import { getHeroResponse } from '../type';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  @ApiBearerAuth('bearer')
  create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
  ): Promise<BlogDocument> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.blogService.create(createBlogDto, req['user'].id as string);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('published') published?: string,
    @Query('popular') popular?: string,
    @Query('category') category?: string,
  ) {
    const isPublished =
      published === 'true' ? true : published === 'false' ? false : undefined;

    const isPopular =
      popular === 'true' ? true : popular === 'false' ? false : undefined;

    return this.blogService.findAll(
      page,
      limit,
      search,
      isPublished,
      isPopular,
      category,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.findOne(id);
  }

  @Get('view/:slug')
  findOneSlug(@Param('slug') slug: string): Promise<BlogDocument> {
    return this.blogService.findOneSlug(slug);
  }

  @Get('count/published')
  getTotalBlog(): Promise<getHeroResponse> {
    return this.blogService.getHero();
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  @ApiBearerAuth('bearer')
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @User('id') userId: string,
  ): Promise<BlogDocument> {
    return this.blogService.update(id, updateBlogDto, userId);
  }
}
