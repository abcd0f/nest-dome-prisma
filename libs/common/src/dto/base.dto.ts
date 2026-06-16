import { DateFormat } from '@nest-app/core';
import { Expose, Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  orderByColumn?: string;

  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => value?.toLowerCase())
  isAsc?: SortOrder;
}

export class PageMetaDto {
  @Expose()
  @IsEnum(SortOrder)
  page!: number;

  @Expose()
  pageSize!: number;

  @Expose()
  total!: number;

  @Expose()
  totalPage!: number;
}

export class PageResponseDto<T> {
  @Expose()
  items!: T[];

  @Expose()
  meta!: PageMetaDto;
}

export class BaseEntityDto {
  @Expose()
  @DateFormat()
  createTime?: Date;

  @Expose()
  updateBy?: string;

  @Expose()
  @DateFormat()
  updateTime?: Date;

  @Expose()
  remark?: string;
}
