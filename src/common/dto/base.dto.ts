import { Expose, Transform, Type } from 'class-transformer';

import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { DateFormat } from '@/common/decorators';

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
  /** 当前页码 */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  /** 每页条数 */
  @IsOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  /** 排序字段 */
  @IsOptional()
  @IsString()
  orderByColumn?: string;

  /** 排序方向 */
  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => value?.toLowerCase())
  isAsc?: SortOrder;
}

export class PageMetaDto {
  /** 当前页码 */
  @Expose()
  @IsEnum(SortOrder)
  page: number;

  /** 每页条数 */
  @Expose()
  pageSize: number;

  /** 总记录数 */
  @Expose()
  total: number;

  /** 总页数 */
  @Expose()
  totalPage: number;
}

export class PageResponseDto<T> {
  /** 数据列表 */
  @Expose()
  items: T[];

  /** 分页信息 */
  @Expose()
  meta: PageMetaDto;
}

/**
 * 基础实体 DTO（包含通用审计字段）
 */
export class BaseEntityDto {
  /** 创建时间 */
  @Expose()
  @DateFormat()
  createTime?: Date;

  /** 更新者 */
  @Expose()
  updateBy?: string;

  /** 更新时间 */
  @Expose()
  @DateFormat()
  updateTime?: Date;

  /** 备注 */
  @Expose()
  remark?: string;
}
