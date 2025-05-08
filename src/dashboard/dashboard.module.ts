import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { BlogModule } from '../blog/blog.module';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [BlogModule, CategoryModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
