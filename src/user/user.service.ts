import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FilterQuery, PaginateModel } from 'mongoose';
import { UserDocumentWithoutPassword } from 'src/type';
import * as bcrypt from 'bcryptjs';
import { Roles } from 'src/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: PaginateModel<UserDocument>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
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

    return userUpdate;
  }

  async totalUsers(role?: Roles): Promise<number> {
    let users: User[];
    if (role) {
      users = await this.userModel.find();
    } else {
      users = await this.userModel.find({ role });
    }
    return users.length;
  }
}
