import { Transform, TransformFnParams } from 'class-transformer';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DEFAULT_TIMEZONE = 'Asia/Shanghai';

export function DateFormat(format: string = DEFAULT_DATE_FORMAT): PropertyDecorator {
  return Transform(({ value }: TransformFnParams) => {
    if (value === null || value === undefined) return value;
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) return value;
      return dayjs(value).tz(DEFAULT_TIMEZONE).format(format);
    }
    if (typeof value === 'string') {
      const dateValue = dayjs(value);
      if (dateValue.isValid()) return dateValue.tz(DEFAULT_TIMEZONE).format(format);
    }
    return value;
  });
}

export function formatDateValue(value: unknown, format: string = DEFAULT_DATE_FORMAT): unknown {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return value;
    return dayjs(value).tz(DEFAULT_TIMEZONE).format(format);
  }
  if (typeof value === 'string') {
    const dateValue = dayjs(value);
    if (dateValue.isValid()) return dateValue.tz(DEFAULT_TIMEZONE).format(format);
  }
  return value;
}
