import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthResponse, PayloadToken, SAMESITE } from 'src/type';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const response = await this.authService.login(loginAuthDto);
    res.cookie('token', response.token, {
      httpOnly: false,
      secure: this.configService.get<string>('node.NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('node.SAMESITE') as SAMESITE,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      ...(process.env.NODE_ENV === 'production' && {
        domain: `.${this.configService.get<string>('uri.URI')}`,
      }),
    });
    return response;
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const register = await this.authService.register(createUserDto);
    res.cookie('token', register.token, {
      httpOnly: false,
      secure: this.configService.get<string>('node.NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('node.SAMESITE') as SAMESITE,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      ...(process.env.NODE_ENV === 'production' && {
        domain: `.${this.configService.get<string>('uri.URI')}`,
      }),
    });
    return register;
  }

  @Get('revalidate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('bearer')
  async AuthGuard(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    const { user, token } = await this.authService.revalidateUser(
      req['user'] as PayloadToken,
    );

    res.cookie('token', token, {
      httpOnly: false,
      secure: this.configService.get<string>('node.NODE_ENV') === 'production',
      sameSite: this.configService.get<string>('node.SAMESITE') as SAMESITE,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      ...(process.env.NODE_ENV === 'production' && {
        domain: `.${this.configService.get<string>('uri.URI')}`,
      }),
    });

    return {
      token,
      user,
    };
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return this.authService.logout();
  }
}
