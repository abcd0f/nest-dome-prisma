import { paginate, toDto, toPageDto } from '@nest-app/common';
import { PrismaService } from '@nest-app/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@orm/generated/prisma/client';
import { OperationLogQueryDto } from './dto/query.dto';
import { OperationLogResponseDto } from './dto/response.dto';

export interface OperationLogContext {
  operateTime?: Date;
  duration: number;
  ip?: string | null;
  requestMethod: string;
  requestUrl: string;
  requestParams?: unknown;
  responseStatus?: number | null;
  responseParams?: unknown;
  userId?: string | null;
  username?: string | null;
  departmentId?: string | null;
  departmentName?: string | null;
  module?: string | null;
  operation?: string | null;
  errorMessage?: string | null;
}

function toNullableJson(value: unknown) {
  return value ?? Prisma.DbNull;
}

@Injectable()
export class OperationLogService {
  constructor(private readonly prisma: PrismaService) {}

  async record(context: OperationLogContext) {
    return this.prisma.operationLog.create({
      data: {
        operateTime: context.operateTime ?? new Date(),
        duration: context.duration,
        ip: context.ip ?? null,
        requestMethod: context.requestMethod,
        requestUrl: context.requestUrl,
        requestParams: toNullableJson(context.requestParams) as any,
        responseStatus: context.responseStatus ?? null,
        responseParams: toNullableJson(context.responseParams) as any,
        userId: context.userId ?? null,
        username: context.username ?? null,
        departmentId: context.departmentId ?? null,
        departmentName: context.departmentName ?? null,
        module: context.module ?? null,
        operation: context.operation ?? null,
        errorMessage: context.errorMessage ?? null,
      },
    });
  }

  async findAll(query: OperationLogQueryDto) {
    const { page, pageSize, orderByColumn, isAsc, startTime, endTime, requestMethod, module, username, ip } = query;
    const where = {
      ...(startTime || endTime
        ? {
            operateTime: {
              ...(startTime ? { gte: new Date(startTime) } : {}),
              ...(endTime ? { lte: new Date(endTime) } : {}),
            },
          }
        : {}),
      ...(requestMethod ? { requestMethod } : {}),
      ...(module ? { module: { contains: module } } : {}),
      ...(username ? { username: { contains: username } } : {}),
      ...(ip ? { ip: { contains: ip } } : {}),
    };
    const data = await paginate(this.prisma.operationLog, {
      page,
      pageSize,
      where,
      orderBy: { orderByColumn: orderByColumn ?? 'operateTime', isAsc: isAsc ?? 'desc' },
    });
    return toPageDto(OperationLogResponseDto, data);
  }

  async findOne(id: string) {
    const data = await this.prisma.operationLog.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('没有找到该操作日志');
    return toDto(OperationLogResponseDto, data);
  }
}
