import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Blog } from 'src/blog/schema/blog.schema';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({
  collection: 'categories',
  timestamps: true,
  versionKey: false,
})
export class Category {
  _id: string;
  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({ required: true, type: String, trim: true })
  description: string;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }] })
  blogs: Blog[];
}
export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(mongoosePaginate);
