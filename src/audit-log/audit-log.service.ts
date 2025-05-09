import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { PaginateModel } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schema/audit-log.schema';
import { UserService } from 'src/user/user.service';
import { BlogService } from 'src/blog/blog.service';
import { CategoryService } from 'src/category/category.service';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument } from 'src/category/schema/category.schema';
import { BlogDocument } from 'src/blog/schema/blog.schema';
import { UserDocumentWithoutPassword } from 'src/type';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditLogModel: PaginateModel<AuditLogDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly blogService: BlogService,
  ) {}

  async create(createAuditLogDto: CreateAuditLogDto) {
    const userCreator = await this.userService.findOne(
      createAuditLogDto.userCreator,
    );

    const data = {
      blog: undefined as BlogDocument | undefined,
      category: undefined as CategoryDocument | undefined,
      user: undefined as UserDocumentWithoutPassword | undefined,
    };

    switch (createAuditLogDto.entityType) {
      case 'CATEGORY':
        data.category = await this.categoryService.findOne(
          createAuditLogDto.idAction,
        );
        break;
      case 'BLOG':
        data.blog = await this.blogService.findOne(createAuditLogDto.idAction);
        break;
      case 'USER':
        data.user = await this.userService.findOne(createAuditLogDto.idAction);
        break;
    }

    const newAuditLog = new this.auditLogModel({
      ...createAuditLogDto,
      userCreator,
      ...data,
    });

    return await newAuditLog.save();
  }

  findAll() {
    return `This action returns all auditLog`;
  }
}
