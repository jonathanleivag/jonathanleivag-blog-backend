import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogDocument } from './schema/blog.schema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/enum';
import { Role } from 'src/auth/decorators/roles.decorator';
import { Request } from 'express';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  create(
    @Body() createBlogDto: CreateBlogDto,
    @Req() req: Request,
  ): Promise<BlogDocument> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return this.blogService.create(createBlogDto, req['user'].id as string);
  }

  @Get()
  findAll(): Promise<BlogDocument[]> {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BlogDocument> {
    return this.blogService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Role(Roles.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    return this.blogService.update(id, updateBlogDto);
  }
}
