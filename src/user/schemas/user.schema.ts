import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Roles } from 'src/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
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

  @Prop({ default: true, type: Boolean })
  isActive: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
