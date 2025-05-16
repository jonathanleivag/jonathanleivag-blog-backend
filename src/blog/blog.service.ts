import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { Blog, BlogDocument } from './schema/blog.schema';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { getHeroResponse, Tendencies } from '../type';
import formatMinutesToHours from '../utils/formatMinutesToHours.util';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: PaginateModel<BlogDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => AuditLogService))
    private readonly auditLogService: AuditLogService,
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

    await this.categoryService.update(
      category._id,
      {
        blogs: [...category.blogs, newBlog],
      },
      user._id,
    );

    await this.auditLogService.create({
      action: `Blog created: ${newBlog.title}`,
      userCreator: user._id,
      entityType: 'BLOG',
      idAction: newBlog._id,
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
    categoryName?: string,
  ): Promise<any> {
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

    let categoryFilter = {};
    if (categoryName) {
      const category = await this.categoryService.findOneName(categoryName);
      if (category) {
        categoryFilter = { category: category._id };
      }
    }

    const filters = {
      ...baseQuery,
      ...categoryFilter,
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

    return await this.blogModel.paginate(filters, options);
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
    userId: string,
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
      await this.categoryService.update(
        blog.category._id,
        {
          blogs: blog.category.blogs.filter(
            (item) => item._id.toString() !== blog._id.toString(),
          ),
        },
        userId,
      );

      const newCategory = await this.categoryService.findOne(
        updateBlogDto.category,
      );

      await this.categoryService.update(
        newCategory._id,
        {
          blogs: [...newCategory.blogs, blog],
        },
        userId,
      );
    }

    const newBlogUpdated = (await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .populate('user category')) as BlogDocument;

    await this.auditLogService.create({
      action: `Blog updated: ${newBlogUpdated.title}`,
      userCreator: newBlogUpdated.user._id,
      entityType: 'BLOG',
      idAction: newBlogUpdated._id,
    });

    return newBlogUpdated;
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

  async getAverageReadingTime(): Promise<number> {
    const blogs = await this.blogModel.find({
      published: true,
      views: { $gt: 0 },
    });
    if (blogs.length === 0) return 0;
    const totalReadingTime = blogs.reduce(
      (sum, blog) => sum + blog.readingTime,
      0,
    );
    return totalReadingTime / blogs.length;
  }

  async getAverageTime(): Promise<number> {
    const blogs = await this.blogModel.find({
      published: true,
    });
    if (blogs.length === 0) return 0;
    const totalReadingTime = blogs.reduce(
      (sum, blog) => sum + blog.readingTime,
      0,
    );
    return totalReadingTime / blogs.length;
  }

  async getFeaturedBlog(): Promise<number> {
    const blogs = await this.blogModel.find({
      published: true,
      popular: true,
    });
    return blogs.length;
  }

  async getTendencies(): Promise<Tendencies> {
    const blogs = await this.blogModel.find({
      published: true,
      views: { $gt: 0 },
    });

    const blogMostViews = await this.blogModel
      .findOne({
        published: true,
        views: { $gt: 0 },
      })
      .sort({ views: -1 })
      .select('title views')
      .lean();

    if (blogs.length < 2)
      return {
        trend: '→ estable',
        percentage: 0,
        title: blogMostViews?.title || '',
      };
    const sorted = [...blogs].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2));
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2));

    const avgFirst =
      firstHalf.reduce((sum, b) => sum + b.views, 0) / firstHalf.length;
    const avgSecond =
      secondHalf.reduce((sum, b) => sum + b.views, 0) / secondHalf.length;

    const percentage =
      avgFirst === 0 ? 0 : ((avgSecond - avgFirst) / avgFirst) * 100;

    if (percentage > 5)
      return {
        trend: '↑ aumento',
        percentage,
        title: blogMostViews?.title || '',
      };
    if (percentage < -5)
      return {
        trend: '↓ disminución',
        percentage,
        title: blogMostViews?.title || '',
      };
    return {
      trend: '→ estable',
      percentage,
      title: blogMostViews?.title || '',
    };
  }

  async getTotalBlog(published?: boolean): Promise<number> {
    let blogs: Blog[];

    if (published) {
      blogs = await this.blogModel.find({ published });
    } else {
      blogs = await this.blogModel.find();
    }
    return blogs.length;
  }

  async getTotalViewTimeInMinutes(): Promise<string> {
    const blogs = await this.blogModel.find({
      published: true,
    });
    return formatMinutesToHours(
      blogs.reduce((total, blog) => total + blog.views * blog.readingTime, 0),
    );
  }

  async getHero(): Promise<getHeroResponse> {
    const totalViews = await this.blogModel.aggregate<{ total: number }>([
      {
        $match: {
          published: true,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$views' },
        },
      },
    ]);

    return {
      blogs: await this.getTotalBlog(true),
      readers: totalViews[0].total ?? 0,
    };
  }

  async getAllBlog() {
    return this.blogModel.find({ published: true });
  }
}
