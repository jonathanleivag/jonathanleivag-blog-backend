import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [UserModule, ConfigModule, AuditLogModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
