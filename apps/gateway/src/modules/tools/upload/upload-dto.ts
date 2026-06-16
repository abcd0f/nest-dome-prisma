import type { Readable } from 'node:stream';
import { DateFormat } from '@nest-app/core';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @Expose()
  fileName!: string;

  @IsString()
  @Expose()
  name!: string;

  @IsString()
  @Expose()
  path!: string;

  @IsString()
  @Expose()
  type!: string;

  @IsString()
  @Expose()
  size!: string;

  @IsString()
  @Expose()
  @DateFormat()
  currentDate!: string;
}

export interface UploadInput {
  filename: string;
  mimetype: string;
  stream: Readable;
}
