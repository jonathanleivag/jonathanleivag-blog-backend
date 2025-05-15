import {Roles} from './enum';
import {UserDocument} from './user/schemas/user.schema';

export type UserDocumentWithoutPassword = Omit<UserDocument, 'password'>;

export interface PayloadToken {
  id: string;
  role: Roles;
}
export interface AuthResponse {
  token: string;
  user: UserDocumentWithoutPassword;
}

export type SAMESITE = boolean | 'lax' | 'strict' | 'none' | undefined;

export type Trend = '↑ aumento' | '↓ disminución' | '→ estable';

export interface Tendencies {
  trend: Trend;
  percentage: number;
  title: string;
}

export interface DashboardResponse {
  totalBlogs: number;
  totalBlogsPublished: number;
  totalBlogsDraft: number;
  totalCategories: number;
  totalCategoriesPublished: number;
  totalCategoriesDraft: number;
  totalUsers: number;
  totalUserAdmin: number;
  totalUserUser: number;
  views: string;
  averageReadings: number;
  averageTime: number;
  featuredBlog: number;
  tendencies: Tendencies;
}

export type EntityType = 'CATEGORY' | 'BLOG' | 'USER';

export interface getHeroResponse {
  blogs: number;
  readers: number;
}
