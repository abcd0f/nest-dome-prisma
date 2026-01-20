import type { PageResult, PaginationParams } from '@/common/types';

interface FindManyDelegate<T> {
  findMany: (...args: any[]) => Promise<T[]>;
  count: (...args: any[]) => Promise<number>;
}

/**
 * 通用分页查询工具
 * @param delegate PrismaService 实例
 * @param params 分页参数（page, pageSize, where, orderBy）
 */
export async function paginate<T, Where = any, OrderBy = any>(
  delegate: FindManyDelegate<T>,
  params: PaginationParams<Where, OrderBy> = {},
): Promise<PageResult<T>> {
  // 配置默认值

  // 解析并验证参数
  let { page = 1, pageSize = 10, where, orderBy } = params;

  // 参数校验与修正
  page = Math.max(1, Math.floor(page));
  pageSize = Math.max(1, Math.floor(pageSize));

  // 计算偏移量
  const skip = (page - 1) * pageSize;

  // 构建查询参数
  const findManyArgs: any = {
    where,
    skip,
    take: pageSize,
  };

  if (orderBy) {
    findManyArgs.orderBy = orderBy;
  }

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
