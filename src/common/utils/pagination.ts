import type { PageResult, PaginationParams } from '@/common/types';

/**
 * Prisma findMany / count 通用 delegate 约束
 */
interface FindManyDelegate<T> {
  findMany: (...args: any[]) => Promise<T[]>;
  count: (...args: any[]) => Promise<number>;
}

/**
 * 排序参数接口
 */
interface OrderByParams {
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
}

/**
 * 构建 Prisma orderBy 对象
 *
 * @param orderBy 排序参数
 * @returns Prisma orderBy 对象
 *
 * @example
 * buildOrderBy() // { createTime: 'desc' }
 * buildOrderBy({ orderByColumn: 'name' }) // { name: 'desc' }
 * buildOrderBy({ isAsc: 'asc' }) // { createTime: 'asc' }
 * buildOrderBy({ orderByColumn: 'name', isAsc: 'asc' }) // { name: 'asc' }
 */
function buildOrderBy(orderBy?: any): any {
  // 没有传入排序参数，使用默认排序
  if (!orderBy) {
    return { createTime: 'desc' };
  }

  // 如果是包含 orderByColumn 或 isAsc 的对象
  if ('orderByColumn' in orderBy || 'isAsc' in orderBy) {
    const { orderByColumn = 'createTime', isAsc = 'desc' } = orderBy as OrderByParams;
    return { [orderByColumn]: isAsc };
  }

  // 直接返回标准 Prisma orderBy 对象
  return orderBy;
}

/**
 * 验证并规范化分页参数
 *
 * @param page 页码
 * @param pageSize 每页条数
 * @returns 规范化后的分页参数
 */
function normalizePaginationParams(page?: number, pageSize?: number) {
  const normalizedPage = Math.max(1, Math.floor(page || 1));
  const normalizedPageSize = Math.min(100, Math.max(1, Math.floor(pageSize || 10)));

  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
    skip: (normalizedPage - 1) * normalizedPageSize,
  };
}

/**
 * 通用分页查询工具
 *
 * @param delegate Prisma Model Delegate（如 this.prisma.user）
 * @param params   分页参数
 * @returns 分页结果
 *
 * @example
 * ```typescript
 * // 基础分页（默认 createTime desc）
 * await paginate(this.prisma.user, { page: 1, pageSize: 10 });
 *
 * // 只传排序字段（默认 desc）
 * await paginate(this.prisma.user, {
 *   page: 1,
 *   pageSize: 10,
 *   orderBy: { orderByColumn: 'name' }  // → { name: 'desc' }
 * });
 *
 * // 只传排序方向（默认 createTime）
 * await paginate(this.prisma.user, {
 *   page: 1,
 *   pageSize: 10,
 *   orderBy: { isAsc: 'asc' }  // → { createTime: 'asc' }
 * });
 *
 * // 传完整排序参数
 * await paginate(this.prisma.user, {
 *   page: 1,
 *   pageSize: 10,
 *   orderBy: { orderByColumn: 'name', isAsc: 'asc' }  // → { name: 'asc' }
 * });
 *
 * // 带条件查询
 * await paginate(this.prisma.user, {
 *   page: 1,
 *   pageSize: 10,
 *   where: { status: 'active' },
 *   orderBy: { orderByColumn: 'updatedAt', isAsc: 'desc' }
 * });
 *
 * // 字段选择
 * await paginate(this.prisma.user, {
 *   page: 1,
 *   pageSize: 10,
 *   select: { id: true, name: true },
 *   orderBy: { orderByColumn: 'id' }
 * });
 *
 * // 使用标准 Prisma orderBy（高级用法）
 * await paginate(this.prisma.user, {
 *   page: 1,
 *   pageSize: 10,
 *   orderBy: [{ createTime: 'desc' }, { id: 'asc' }]  // 多字段排序
 * });
 * ```
 */
export async function paginate<T, Where = any, OrderBy = any, Select = any, Omit = any>(
  delegate: FindManyDelegate<T>,
  params: PaginationParams<Where, OrderBy, Select, Omit> = {},
): Promise<PageResult<T>> {
  const { where, orderBy, select, omit } = params;

  // select 和 omit 互斥校验
  if (select && omit) {
    throw new Error('Cannot use both "select" and "omit" at the same time');
  }

  // 规范化分页参数
  const { page, pageSize, skip } = normalizePaginationParams(params.page, params.pageSize);

  // 构建排序参数
  const finalOrderBy = buildOrderBy(orderBy);

  // 构建查询参数
  const findManyArgs: any = {
    where,
    skip,
    take: pageSize,
    orderBy: finalOrderBy,
  };

  // 添加字段选择（互斥）
  if (select) {
    findManyArgs.select = select;
  } else if (omit) {
    findManyArgs.omit = omit;
  }

  // count 查询参数
  const countArgs: any = { where };

  // 并行执行查询
  const [items, total] = await Promise.all([delegate.findMany(findManyArgs), delegate.count(countArgs)]);

  // 计算总页数
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
