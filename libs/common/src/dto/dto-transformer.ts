import { ClassConstructor, plainToInstance } from 'class-transformer';
import { PageMetaDto } from './base.dto';

const SERIALIZE_OPTIONS = { excludeExtraneousValues: true, enableImplicitConversion: true };

export function toDto<T>(cls: ClassConstructor<T>, plain: object | null | undefined): T | null {
  if (plain === null || plain === undefined) return null;
  return plainToInstance(cls, plain, SERIALIZE_OPTIONS);
}

export function toDtoList<T>(cls: ClassConstructor<T>, plainList: object[] | null | undefined): T[] {
  if (!plainList || !Array.isArray(plainList)) return [];
  return plainList.map((item) => plainToInstance(cls, item, SERIALIZE_OPTIONS));
}

export function toPageDto<T>(
  cls: ClassConstructor<T>,
  data: { items: object[]; meta: { page: number; pageSize: number; total: number; totalPage: number } },
) {
  return {
    items: toDtoList(cls, data.items),
    meta: plainToInstance(PageMetaDto, data.meta, SERIALIZE_OPTIONS),
  };
}
