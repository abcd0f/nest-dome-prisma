import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { DateFormat } from '@/common/decorators/date-format.decorator';

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
  @ApiPropertyOptional({ description: '页码（从1开始）', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: '每页条数', default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  @ApiPropertyOptional({ description: '排序字段' })
  @IsOptional()
  @IsString()
  orderByColumn?: string;

  @ApiPropertyOptional({ description: '排序方向', enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) => value?.toLowerCase())
  isAsc?: SortOrder;
}

export class PageMetaDto {
  @ApiPropertyOptional({ description: '当前页码', enum: SortOrder })
  @Expose()
  page: number;

  @ApiProperty({ description: '每页条数', example: 10 })
  @Expose()
  pageSize: number;

  @ApiProperty({ description: '总记录数', example: 100 })
  @Expose()
  total: number;

  @ApiProperty({ description: '总页数', example: 100 })
  @Expose()
  totalPage: number;
}

export class PageResponseDto<T> {
  @ApiProperty({ description: '数据列表', isArray: true })
  @Expose()
  items: T[];

  @ApiProperty({ description: '分页信息', isArray: true })
  @Expose()
  meta: PageMetaDto;
}

/**
 * 基础实体 DTO（包含通用审计字段）
 */
export class BaseEntityDto {
  @ApiPropertyOptional({ description: '创建时间' })
  @Expose()
  @DateFormat()
  createTime?: Date;

  @ApiPropertyOptional({ description: '更新者' })
  @Expose()
  updateBy?: string;

  @ApiPropertyOptional({ description: '更新时间' })
  @Expose()
  updateTime?: Date;

  @ApiPropertyOptional({ description: '备注' })
  @Expose()
  remark?: string;
}
