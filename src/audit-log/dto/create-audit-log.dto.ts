import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EntityType } from '../../type';

export class CreateAuditLogDto {
  @IsString({ message: 'Action must be a string' })
  @IsNotEmpty({ message: 'Action is required' })
  action: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsMongoId()
  @IsNotEmpty({ message: 'UserCreator is required' })
  userCreator: string;

  @IsOptional()
  @IsMongoId()
  blog?: string;

  @IsOptional()
  @IsMongoId()
  category?: string;

  @IsOptional()
  @IsMongoId()
  user?: string;

  @IsEnum(['blog', 'category', 'user'])
  @IsNotEmpty({ message: 'EntityType is required' })
  entityType: EntityType;

  @IsMongoId()
  @IsNotEmpty({ message: 'IdAction is required' })
  idAction: string;
}
