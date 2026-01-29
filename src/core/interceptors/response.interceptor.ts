import type { ComplexResponse, PageResult, ResponseMode, SimpleResponse } from '@/common/types';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';

import { map, Observable } from 'rxjs';

import { formatToDateTime } from '@/utils/date.util';

/* ===================== 常量 ===================== */

const STATUS_MESSAGES: Record<number, string> = {
  [HttpStatus.OK]: '操作成功',
  [HttpStatus.CREATED]: '创建成功',
  [HttpStatus.NO_CONTENT]: '删除成功',
  [HttpStatus.BAD_REQUEST]: '请求参数错误',
  [HttpStatus.UNAUTHORIZED]: '未授权访问',
  [HttpStatus.FORBIDDEN]: '禁止访问',
  [HttpStatus.NOT_FOUND]: '资源不存在',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务器内部错误',
};

/* ===================== 工具函数 ===================== */

function isPageResult(data: any): data is PageResult<any> {
  return (
    data && typeof data === 'object' && Array.isArray(data.items) && data.meta && typeof data.meta.page === 'number'
  );
}

function shouldIncludeData(status: number, data: unknown): boolean {
  return status !== HttpStatus.NO_CONTENT && data !== undefined && data !== null;
}

function resolveMessage(status: number, custom?: string): string {
  return custom ?? STATUS_MESSAGES[status] ?? '操作成功';
}

/* ===================== 拦截器 ===================== */

@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor<T, SimpleResponse | ComplexResponse> {
  constructor(private readonly mode: ResponseMode = 'complex') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<SimpleResponse | ComplexResponse> {
    const http = context.switchToHttp();
    const res = http.getResponse<FastifyReply>();
    const req = http.getRequest<FastifyRequest>();

    return next.handle().pipe(
      map((raw) => {
        const status = res.statusCode;
        const success = status >= 200 && status < 300;

        const { data, msg } = this.normalizeResult(raw);
        const message = resolveMessage(status, msg);

        const payload = this.normalizeData(status, data);

        return this.mode === 'simple'
          ? this.buildSimple(status, message, payload)
          : this.buildComplex(status, message, success, req.url, payload);
      }),
    );
  }

  /* ===================== 构建器 ===================== */

  private buildSimple(code: number, msg: string, payload?: { data?: any; meta?: any }): SimpleResponse {
    return {
      code,
      msg,
      ...payload,
    };
  }

  private buildComplex(
    code: number,
    msg: string,
    success: boolean,
    path: string,
    payload?: { data?: any; meta?: any },
  ): ComplexResponse {
    return {
      code,
      success,
      msg,
      timestamp: formatToDateTime(new Date()),
      path,
      ...payload,
    };
  }

  /* ===================== 规范化 ===================== */

  private normalizeResult(result: any): { data?: any; msg?: string } {
    if (result && typeof result === 'object' && ('data' in result || 'msg' in result)) {
      return result;
    }
    return { data: result };
  }

  private normalizeData(status: number, data: any): { data?: any; meta?: any } | undefined {
    if (!shouldIncludeData(status, data)) return;

    if (isPageResult(data)) {
      return {
        data: data.items,
        meta: data.meta,
      };
    }

    return { data };
  }
}
