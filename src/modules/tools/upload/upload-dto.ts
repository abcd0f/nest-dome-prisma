import type { Readable } from 'node:stream';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { DateFormat } from '@/core/decorators';

export class UploadFileDto {
  /** 原始文件名 */
  @IsString()
  @Expose()
  fileName: string;

  /** 重命名后的文件名 */
  @IsString()
  @Expose()
  name: string;

  /** 文件存储路径 */
  @IsString()
  @Expose()
  path: string;

  /** 文件类型，例如 image、video、document */
  @IsString()
  @Expose()
  type: string;

  /** 文件大小，如 2.3MB */
  @IsString()
  @Expose()
  size: string;

  /** 上传日期，格式 YYYY-MM-DD */
  @IsString()
  @Expose()
  @DateFormat()
  currentDate: string;
}

export interface UploadInput {
  /** 原始文件名 */
  filename: string;

  /** MIME 类型 */
  mimetype: string;

  /** Fastify multipart 提供的可读流 */
  stream: Readable;
}
