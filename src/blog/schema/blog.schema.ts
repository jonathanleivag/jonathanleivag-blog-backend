import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Category } from 'src/category/schema/category.schema';
import { User } from 'src/user/schemas/user.schema';

export type BlogDocument = HydratedDocument<Blog>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Blog {
  @Prop({ required: true, trim: true, unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ default: false })
  published: boolean;

  @Prop({ required: true })
  slug: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  readingTime: number;

  @Prop({ default: false })
  popular: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category: Category;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
