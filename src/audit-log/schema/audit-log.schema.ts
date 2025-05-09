import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { EntityType } from '../../type';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { User } from '../../user/schemas/user.schema';
import { Blog } from '../../blog/schema/blog.schema';
import { Category } from '../../category/schema/category.schema';

export type AuditLogDocument = HydratedDocument<AuditLog>;

@Schema({ timestamps: true, versionKey: false })
export class AuditLog extends Document {
  @Prop({ required: true })
  action: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userCreator: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Blog.name })
  blog?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Category.name })
  category?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user?: string;

  @Prop()
  entityType: EntityType;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.plugin(mongoosePaginate);
