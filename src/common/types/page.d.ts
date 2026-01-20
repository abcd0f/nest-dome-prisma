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
