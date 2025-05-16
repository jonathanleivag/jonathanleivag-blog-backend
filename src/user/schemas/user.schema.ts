import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Roles } from 'src/enum';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  _id: string;
  @Prop({ required: true, type: String, trim: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
    index: true,
    sparse: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  })
  email: string;

  @Prop({ required: true, type: String, trim: true })
  password: string;

  @Prop({ required: true, type: String, trim: true })
  phone: string;

  @Prop({
    type: String,
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @Prop({ type: String, trim: true, default: '' })
  description: string;

  @Prop({ type: String, trim: true, default: '' })
  location: string;

  @Prop({ type: Date, trim: true })
  start: Date;

  @Prop({ type: String, trim: true, default: '' })
  webSite: string;

  @Prop({
    type: String,
    trim: true,
    default:
      'https://res.cloudinary.com/dq8fpb695/image/upload/v1662878253/jonathanleivag/logo/ohbxjqje4kelihconfov.png',
  })
  avatar: string;

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(mongoosePaginate);
