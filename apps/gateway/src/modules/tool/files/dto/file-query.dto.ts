import { PageQueryDto } from '@nest-app/common';
import { IsOptional, IsString } from 'class-validator';

export class FileQueryDto extends PageQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsString()
  bucket?: string;
}
