import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schema/blog.schema';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
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

    const blogs = await this.blogModel
      .find(filters)
      .populate('user category')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.blogModel.countDocuments(filters);

    return {
      data: blogs,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
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
    const blog = await this.blogModel.findById(id);
    if (!blog) {
      throw new HttpException('Blog not found', HttpStatus.NOT_FOUND);
    }

    return (await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .populate('user category')) as BlogDocument;
  }
}
