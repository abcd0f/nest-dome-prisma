export interface PaginationParams<Where = any, OrderBy = any, Select = any, Omit = any> {
  page?: number;
  pageSize?: number;
  where?: Where;
  orderBy?: OrderBy;
  select?: Select;
  omit?: Omit;
}

export interface PageMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface PageResult<T> {
  items: T[];
  meta: PageMeta;
}
