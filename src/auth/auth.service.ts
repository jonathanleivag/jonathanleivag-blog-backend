import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AuthResponse,
  PayloadToken,
  UserDocumentWithoutPassword,
} from 'src/type';
import { UserService } from 'src/user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Roles } from 'src/enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<AuthResponse> {
    const user = await this.userService.findOneByEmail(loginAuthDto.email);

    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = (
      user as UserDocument
    ).toObject();

    const payload: PayloadToken = {
      id: user._id,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
      user: userWithoutPassword as UserDocumentWithoutPassword,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    createUserDto.role = Roles.USER;
    const user = await this.userService.create(createUserDto);
    const payload: PayloadToken = {
      id: user._id,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payload),
      user: user,
    };
  }

  async revalidateUser(payload: PayloadToken): Promise<AuthResponse> {
    const user = await this.userService.findOne(payload.id);

    const payloadToken: PayloadToken = {
      id: user._id,
      role: user.role,
    };

    return {
      token: this.jwtService.sign(payloadToken),
      user: user,
    };
  }

  logout() {
    return {
      message: 'Logged out',
    };
  }
}
