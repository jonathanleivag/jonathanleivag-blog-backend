import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { PaginateModel } from 'mongoose';
import { Blog } from '../blog/schema/blog.schema';
import { AuditLogService } from 'src/audit-log/audit-log.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: PaginateModel<CategoryDocument>,
    @Inject(forwardRef(() => AuditLogService))
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    userId: string,
  ): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({
      name: createCategoryDto.name,
    });

    if (category) {
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newCategory = new this.categoryModel(createCategoryDto);
    const categorySave = await newCategory.save();

    await this.auditLogService.create({
      action: `Category created: ${newCategory.name}`,
      userCreator: userId,
      entityType: 'CATEGORY',
      idAction: categorySave._id,
    });

    return categorySave;
  }

  async findAll(): Promise<CategoryDocument[]> {
    return await this.categoryModel.find();
  }

  async findOne(id: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id).populate('blogs');

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<CategoryDocument> {
    const category = await this.categoryModel.findById(id);

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const updatedCategory = (await this.categoryModel.findByIdAndUpdate(
      id,
      updateCategoryDto,
      {
        new: true,
      },
    )) as CategoryDocument;

    await this.auditLogService.create({
      action: `Category updated: ${updatedCategory.name}`,
      userCreator: userId,
      entityType: 'CATEGORY',
      idAction: updatedCategory._id,
    });

    return updatedCategory;
  }

  async categoryByBlogs(
    published?: boolean,
    popular?: boolean,
    page = 1,
    limit = 10,
    search?: string,
    isActive?: boolean,
  ): Promise<any> {
    const filters = {
      ...(typeof published === 'boolean' && { published }),
      ...(typeof popular === 'boolean' && { popular }),
    };

    const query: any = {
      ...(typeof isActive === 'boolean' && { isActive }),
      ...(search ? { name: { $regex: search, $options: 'i' } } : {}),
    };

    return await this.categoryModel.paginate(query, {
      page,
      limit,
      populate: {
        path: 'blogs',
        match: filters,
        populate: {
          path: 'user',
          select: '-password',
        },
      },
    });
  }

  async getTotalCategory(published?: boolean): Promise<number> {
    let categories: Blog[];

    if (published) {
      categories = await this.categoryModel.find({ published });
    } else {
      categories = await this.categoryModel.find();
    }
    return categories.length;
  }
}
