interface FindManyDelegate<T> {
  findMany: (...args: any[]) => Promise<T[]>;
  count: (...args: any[]) => Promise<number>;
}

/**
 * 分页查询参数
 *
 * @template Where 查询条件的类型（通常为 Prisma 的 WhereInput）
 */
export interface PaginationParams<Where = any, OrderBy = any> {
  /** 当前页码，从 1 开始 @default 1 */
  page?: number;
  /** 每页数量 @default 10 */
  pageSize?: number;
  /** 查询条件 */
  where?: Where;
  /** 排序条件 */
  orderBy?: OrderBy;
}
/** 分页元信息 */
export interface PageMeta {
  /* 当前页码（从 1 开始） */
  page: number;
  /* 每页返回的数据条数 */
  pageSize: number;
  /* 满足查询条件的记录总数 */
  total: number;
  /* 总页数 */
  totalPage: number;
}

/**
 * 通用分页查询结果
 *
 * @template T 单条数据的类型
 */
export interface PageResult<T> {
  /** 当前页的数据列表 */
  items: T[];

  /* 分页元信息* 描述当前页码、总记录数、总页数等 */
  meta: PageMeta;
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
