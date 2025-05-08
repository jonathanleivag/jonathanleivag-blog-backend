import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Blog, BlogDocument } from './schema/blog.schema';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: PaginateModel<BlogDocument>,
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
  ) {}

  async create(
    createBlogDto: CreateBlogDto,
    idUser: string,
  ): Promise<BlogDocument> {
    const blog = await this.blogModel.findOne({ title: createBlogDto.title });

    if (blog) {
      throw new HttpException('Blog already exists', HttpStatus.BAD_REQUEST);
    }

    if (createBlogDto.popular && createBlogDto.published) {
      const popular = await this.blogModel.find({
        popular: true,
        published: true,
      });

      if (popular.length >= 3) {
        throw new HttpException(
          'The number of popular blogs has been reached',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    createBlogDto.user = idUser;
    const user = await this.userService.findOne(createBlogDto.user);
    const category = await this.categoryService.findOne(createBlogDto.category);

    const newBlog = new this.blogModel({
      ...createBlogDto,
      user,
      category,
    });
    await newBlog.save();

    await this.categoryService.update(category._id, {
      blogs: [...category.blogs, newBlog],
    });

    return (await this.blogModel
      .findById(newBlog._id)
      .populate('user category')) as BlogDocument;
  }

  async findAll(
    page: number,
    limit: number,
    search: string,
    published?: boolean,
    popular?: boolean,
  ) {
    const baseQuery = search
      ? {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { content: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ],
        }
      : {};

    const filters = {
      ...baseQuery,
      ...(typeof published === 'boolean' && { published }),
      ...(typeof popular === 'boolean' && { popular }),
    };

    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: ['user', 'category'],
      lean: true,
    };

    const result = await this.blogModel.paginate(filters, options);

    return result;
  }

  async findOne(id: string): Promise<BlogDocument> {
    const blog = await this.blogModel.findById(id).populate('user category');

    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return blog;
  }

  async update(
    id: string,
    updateBlogDto: UpdateBlogDto,
  ): Promise<BlogDocument> {
    const blog = await this.blogModel.findById(id).populate('user category');
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    if (updateBlogDto.popular && updateBlogDto.published) {
      const popular = await this.blogModel.find({
        popular: true,
        published: true,
      });

      if (popular.length >= 3) {
        throw new HttpException(
          'The number of popular blogs has been reached',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      updateBlogDto.category &&
      blog.category._id.toString() !== updateBlogDto.category
    ) {
      await this.categoryService.update(blog.category._id, {
        blogs: blog.category.blogs.filter(
          (item) => item._id.toString() !== blog._id.toString(),
        ),
      });

      const newCategory = await this.categoryService.findOne(
        updateBlogDto.category,
      );

      await this.categoryService.update(newCategory._id, {
        blogs: [...newCategory.blogs, blog],
      });
    }

    return (await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .populate('user category')) as BlogDocument;
  }

  async findOneSlug(slug: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOne({ slug })
      .populate('user category');

    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }
    return blog;
  }
}
