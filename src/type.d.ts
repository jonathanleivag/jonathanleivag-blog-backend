import { UserDocument } from './user/schemas/user.schema';

export type UserDocumentWithoutPassword = Omit<UserDocument, 'password'>;
