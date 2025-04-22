import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthResponse, PayloadToken } from 'src/type';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AuthGuard } from 'src/user/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  async login(@Body() loginAuthDto: LoginAuthDto): Promise<AuthResponse> {
    return this.authService.login(loginAuthDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return this.authService.register(createUserDto);
  }

  @Get('revalidate')
  @UseGuards(AuthGuard)
  async AuthGuard(@Req() req: Request): Promise<string> {
    return this.authService.revalidateUser(req['user'] as PayloadToken);
  }
}
