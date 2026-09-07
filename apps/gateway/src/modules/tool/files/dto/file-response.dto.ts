import { DateFormat } from '@nest-app/common';
import { Exclude, Expose, Transform } from 'class-transformer';

export class FileResponseDto {
  @Expose()
  id!: string;

  @Expose()
  bucket!: string;

  @Expose()
  objectKey!: string;

  @Expose()
  originalName!: string;

  @Expose()
  mimeType!: string;

  @Expose()
  category!: string;

  @Expose()
  @Transform(({ value }) => (typeof value === 'bigint' ? value.toString() : value))
  size!: string;

  @Expose()
  etag!: string | null;

  @Expose()
  @DateFormat()
  createTime!: Date;

  @Exclude()
  deleteTime!: Date | null;
}
