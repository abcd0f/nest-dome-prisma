import type { PageResult, PaginationParams } from '@/common/types';

/**
 * Prisma findMany / count 通用 delegate 约束
 */
interface FindManyDelegate<T> {
  findMany: (...args: any[]) => Promise<T[]>;
  count: (...args: any[]) => Promise<number>;
}

/**
 * 通用分页查询工具
 *
 * @param delegate Prisma Model Delegate（如 this.prisma.user）
 * @param params   分页参数
 */
export async function paginate<T, Where = any, OrderBy = any, Select = any, Omit = any>(
  delegate: FindManyDelegate<T>,
  params: PaginationParams<Where, OrderBy, Select, Omit> = {},
): Promise<PageResult<T>> {
  // 解析并验证参数
  let { page = 1, pageSize = 10, where, orderBy, select, omit } = params;

  // 参数校验与修正
  page = Math.max(1, Math.floor(page));
  pageSize = Math.max(1, Math.floor(pageSize));

  // select 和 omit 互斥校验
  if (select && omit) {
    throw new Error('Cannot use both "select" and "omit" at the same time');
  }

  // 计算偏移量
  const skip = (page - 1) * pageSize;

  // 构建查询参数
  const findManyArgs: any = {
    where,
    skip,
    take: pageSize,
  };

  // 添加排序
  if (orderBy) {
    findManyArgs.orderBy = orderBy;
  }

  // 添加字段选择
  if (select) {
    findManyArgs.select = select;
  }

  // 添加字段排除
  if (omit) {
    findManyArgs.omit = omit;
  }

  // count 查询参数
  const countArgs: any = { where };

  // 并行执行查询
  const [items, total] = await Promise.all([delegate.findMany(findManyArgs), delegate.count(countArgs)]);

  // 计算元信息
  const totalPage = Math.ceil(total / pageSize) || 1;

  return {
    items,
    meta: {
      page,
      pageSize,
      total,
      totalPage,
    },
  };
}
