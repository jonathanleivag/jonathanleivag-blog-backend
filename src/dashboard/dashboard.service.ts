import { Injectable } from '@nestjs/common';
import { DashboardResponse } from '../type';
import { BlogService } from 'src/blog/blog.service';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { Roles } from '../enum';

@Injectable()
export class DashboardService {
  constructor(
    private readonly blogService: BlogService,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<DashboardResponse> {
    const totalCategoriesPublished =
      await this.categoryService.getTotalCategory(true);

    return {
      averageReadings: await this.blogService.getAverageReadingTime(),
      averageTime: await this.blogService.getAverageTime(),
      featuredBlog: await this.blogService.getFeaturedBlog(),
      tendencies: await this.blogService.getTendencies(),
      totalBlogs: await this.blogService.getTotalBlog(),
      totalBlogsDraft: await this.blogService.getTotalBlog(false),
      totalBlogsPublished: await this.blogService.getTotalBlog(true),
      totalCategories: await this.categoryService.getTotalCategory(),
      totalCategoriesDraft: await this.categoryService.getTotalCategory(false),
      totalCategoriesPublished,
      totalUsers: await this.userService.totalUsers(),
      totalUserAdmin: await this.userService.totalUsers(Roles.ADMIN),
      totalUserUser: await this.userService.totalUsers(Roles.USER),
      views: await this.blogService.getTotalViewTimeInMinutes(),
    };
  }
}
