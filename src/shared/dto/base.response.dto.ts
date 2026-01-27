import { Expose } from 'class-transformer';
import { DateFormat } from '@/common/decorators';

/**
 * 基础响应 DTO
 *
 * @description 所有响应 DTO 应继承此类，自动：
 * 1. 排除敏感字段（delFlag, tenantId, password 等）
 * 2. 格式化日期字段（createTime, updateTime）
 */
export abstract class BaseResponseDto {
  /* 创建时间 */
  @Expose()
  @DateFormat()
  createTime?: string;

  /**
   * 更新时间 - 自动格式化为 'YYYY-MM-DD HH:mm:ss'
   */
  @Expose()
  @DateFormat()
  updateTime?: string;
}
