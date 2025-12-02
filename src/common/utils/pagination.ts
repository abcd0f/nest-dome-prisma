import { PrismaService } from '@/database/database.service';

export interface PaginationParams<T> {
  page?: number;
  pageSize?: number;
  where?: T;
}

/**
 * 通用分页查询工具
 * @param prisma PrismaService 实例
 * @param model 模型名（例如 prisma.user / prisma.list）
 * @param params 分页参数（page, pageSize, where, orderBy）
 */
export async function paginate<M extends keyof PrismaService, Where extends object>(
  prisma: PrismaService,
  model: M,
  params: PaginationParams<Where> = {},
) {
  const { page = 1, pageSize = 10, where = {} } = params;
  const skip = (page - 1) * pageSize;

  const client = prisma[model] as any;

  const [data, total] = await prisma.$transaction([
    client.findMany({ where, skip, take: pageSize }),
    client.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    pageSize,
    totalPage: Math.ceil(total / pageSize),
  } as {
    data: Awaited<ReturnType<typeof client.findMany>>;
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
  };
}
