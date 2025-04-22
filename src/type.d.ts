import { Roles } from './enum';
import { UserDocument } from './user/schemas/user.schema';

export type UserDocumentWithoutPassword = Omit<UserDocument, 'password'>;

export interface PayloadToken {
  id: string;
  role: Roles;
}
export interface AuthResponse {
  token: string;
  user: UserDocumentWithoutPassword;
}
