import { Expose } from 'class-transformer';
import { DateFormat } from '@/common/decorators/date-format.decorator';

import { Type, Transform } from 'class-transformer';
import { IsInt, Min, Max, IsOptional, IsEnum, IsString } from 'class-validator';

/** 排序方向枚举 */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/**
 * 基础分页 DTO
 *
 * @description 提供标准的分页参数，所有需要分页的接口都应继承此类
 * 统一分页参数命名规范：
 * - pageNum: 当前页码（从1开始）
 * - pageSize: 每页条数（默认10，最大100）
 * - orderByColumn: 排序字段
 * - isAsc: 排序方向（asc/desc）
 *
 * @example
 * ```typescript
 * export class ListUserDto extends PageQueryDto {
 *   @IsOptional()
 *   @IsString()
 *   userName?: string;
 * }
 * ```
 */
export class PageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

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
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  total: number;

  @Expose()
  totalPage: number;
}

export class PageResponseDto<T> {
  @Expose()
  items: T[];

  @Expose()
  meta: PageMetaDto;
}

/**
 * 基础实体 DTO（包含通用审计字段）
 */
export class BaseEntityDto {
  @Expose()
  @DateFormat()
  createTime?: Date;

  @Expose()
  updateBy?: string;

  @Expose()
  updateTime?: Date;

  @Expose()
  remark?: string;
}
