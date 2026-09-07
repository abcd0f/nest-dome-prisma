import type { PageResult, PaginationParams } from '../types/page';

interface FindManyDelegate<T> {
  findMany: (...args: any[]) => Promise<T[]>;
  count: (...args: any[]) => Promise<number>;
}

interface OrderByParams {
  orderByColumn?: string;
  isAsc?: 'asc' | 'desc';
}

function buildOrderBy(orderBy?: any): any {
  if (!orderBy) return { createTime: 'desc' };

  if ('orderByColumn' in orderBy || 'isAsc' in orderBy) {
    const { orderByColumn = 'createTime', isAsc = 'desc' } = orderBy as OrderByParams;
    return { [orderByColumn]: isAsc };
  }

  return orderBy;
}

function normalizePaginationParams(page?: number, pageSize?: number) {
  const normalizedPage = Math.max(1, Math.floor(page || 1));
  const normalizedPageSize = Math.min(100, Math.max(1, Math.floor(pageSize || 10)));
  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
    skip: (normalizedPage - 1) * normalizedPageSize,
  };
}

export async function paginate<T, Where = any, OrderBy = any, Select = any, Omit = any>(
  delegate: FindManyDelegate<T>,
  params: PaginationParams<Where, OrderBy, Select, Omit> = {},
): Promise<PageResult<T>> {
  const { where, orderBy, select, omit } = params;

  if (select && omit) {
    throw new Error('Cannot use both "select" and "omit" at the same time');
  }

  const { page, pageSize, skip } = normalizePaginationParams(params.page, params.pageSize);

  const finalOrderBy = buildOrderBy(orderBy);

  const findManyArgs: any = {
    where,
    skip,
    take: pageSize,
    orderBy: finalOrderBy,
  };

  if (select) findManyArgs.select = select;
  else if (omit) findManyArgs.omit = omit;

  const countArgs: any = { where };

  const [items, total] = await Promise.all([delegate.findMany(findManyArgs), delegate.count(countArgs)]);

  const totalPage = Math.ceil(total / pageSize) || 1;

  return {
    items,
    meta: { page, pageSize, total, totalPage },
  };
}
