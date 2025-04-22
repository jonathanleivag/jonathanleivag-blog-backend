import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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
}

export const CategorySchema = SchemaFactory.createForClass(Category);
