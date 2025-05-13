import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQuery, PaginateModel } from 'mongoose';
import { EntityType, UserDocumentWithoutPassword } from 'src/type';
import * as bcrypt from 'bcryptjs';
import { Roles } from 'src/enum';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<UserDocument>,
    @Inject(forwardRef(() => AuditLogService))
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    userId?: string,
  ): Promise<UserDocumentWithoutPassword> {
    const user = await this.userModel.findOne({ email: createUserDto.email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const newUser = new this.userModel(createUserDto);
    await newUser.save();

    const userSelected = (await this.userModel
      .findOne({ email: createUserDto.email })
      .select('-password')) as UserDocumentWithoutPassword;

    if (userId) {
      await this.auditLogService.create({
        action: `User created: ${newUser.name}`,
        userCreator: userId,
        entityType: 'USER',
        idAction: userSelected._id,
      });
    }

    return userSelected;
  }

  async findAll(page: number, limit: number, role?: string, search?: string) {
    const options = {
      page,
      limit,
      select: '-password',
    };

    const query: FilterQuery<User> = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }];
    }

    return await this.userModel.paginate(query, options);
  }

  async findOne(id: string): Promise<UserDocumentWithoutPassword> {
    const user = await this.userModel.findById(id).select('-password');

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocumentWithoutPassword> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const userUpdate = (await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')) as UserDocumentWithoutPassword;

    await this.auditLogService.create({
      action: `User updated: ${userUpdate.name}`,
      userCreator: userUpdate._id,
      entityType: userUpdate.role.toUpperCase() as EntityType,
      idAction: userUpdate._id,
    });

    return userUpdate;
  }

  async totalUsers(role?: Roles): Promise<number> {
    let users: User[];
    if (role) {
      users = await this.userModel.find({ role });
    } else {
      users = await this.userModel.find();
    }
    return users.length;
  }
}
