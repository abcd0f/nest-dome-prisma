import { Transform, TransformFnParams } from 'class-transformer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 默认日期格式
 */
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * 默认时区
 * 注意：IANA 时区数据库中没有 Asia/Beijing，使用 Asia/Shanghai 代替（两者时区相同）
 */
export const DEFAULT_TIMEZONE = 'Asia/Shanghai';

/**
 * 日期格式化装饰器
 *
 * @description 在 DTO 序列化时自动将 Date 对象或 ISO 字符串转换为指定格式
 *
 * @param format 日期格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns PropertyDecorator
 *
 * @example
 * ```typescript
 * class UserResponseDto {
 *   @Expose()
 *   @DateFormat()
 *   createTime: string;
 *
 *   @Expose()
 *   @DateFormat('YYYY-MM-DD')
 *   birthDate: string;
 * }
 * ```
 */
export function DateFormat(format: string = DEFAULT_DATE_FORMAT): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (value === null || value === undefined) {
      return value;
    }

    // 处理 Date 对象
    if (value instanceof Date) {
      // 检查是否为有效日期
      if (Number.isNaN(value.getTime())) {
        return value;
      }
      return dayjs(value).tz(DEFAULT_TIMEZONE).format(format);
    }

    // 处理字符串格式的日期
    if (typeof value === 'string') {
      const dateValue = dayjs(value);
      if (dateValue.isValid()) {
        return dateValue.tz(DEFAULT_TIMEZONE).format(format);
      }
    }

    // 其他情况返回原值
    return value;
  });
}

/**
 * 内部辅助函数：格式化日期值
 * 用于测试和其他需要直接调用格式化逻辑的场景
 *
 * @param value 日期值（Date 对象、ISO 字符串或其他）
 * @param format 日期格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的字符串或原值
 */
export function formatDateValue(value: unknown, format: string = DEFAULT_DATE_FORMAT): unknown {
  if (value === null || value === undefined) {
    return value;
  }

  // 处理 Date 对象
  if (value instanceof Date) {
    // 检查是否为有效日期
    if (Number.isNaN(value.getTime())) {
      return value;
    }
    return dayjs(value).tz(DEFAULT_TIMEZONE).format(format);
  }

  // 处理字符串格式的日期
  if (typeof value === 'string') {
    const dateValue = dayjs(value);
    if (dateValue.isValid()) {
      return dateValue.tz(DEFAULT_TIMEZONE).format(format);
    }
  }

  // 其他情况返回原值
  return value;
}
