import { DateFormat } from '@nest-app/common';
import { Expose } from 'class-transformer';

export class OperationLogResponseDto {
  @Expose()
  id!: string;

  @Expose()
  @DateFormat()
  operateTime!: Date;

  @Expose()
  duration!: number;

  @Expose()
  ip!: string | null;

  @Expose()
  requestMethod!: string;

  @Expose()
  requestUrl!: string;

  @Expose()
  requestParams!: unknown;

  @Expose()
  responseStatus!: number | null;

  @Expose()
  responseParams!: unknown;

  @Expose()
  userId!: string | null;

  @Expose()
  username!: string | null;

  @Expose()
  departmentId!: string | null;

  @Expose()
  departmentName!: string | null;

  @Expose()
  module!: string | null;

  @Expose()
  operation!: string | null;

  @Expose()
  errorMessage!: string | null;
}
