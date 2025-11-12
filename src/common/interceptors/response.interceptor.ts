import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 统一响应接口
interface ApiResponse<T = any> {
  data?: T;
  code: number;
  success?: boolean;
  msg: string;
  timestamp?: string;
  path?: string;
}

// 无数据响应接口
interface ApiResponseWithoutData {
  code: number;
  success?: boolean;
  msg: string;
  timestamp?: string;
  path?: string;
}

// 响应消息映射
const STATUS_MESSAGES = {
  [HttpStatus.OK]: '操作成功',
  [HttpStatus.CREATED]: '创建成功',
  [HttpStatus.ACCEPTED]: '请求已接受',
  [HttpStatus.NO_CONTENT]: '删除成功',
  [HttpStatus.BAD_REQUEST]: '请求参数错误',
  [HttpStatus.UNAUTHORIZED]: '未授权访问',
  [HttpStatus.FORBIDDEN]: '禁止访问',
  [HttpStatus.NOT_FOUND]: '资源不存在',
  [HttpStatus.INTERNAL_SERVER_ERROR]: '服务器内部错误',
} as const;

type ResponseMode = 'simple' | 'complex';

/**
 * 拦截器核心方法，用于统一处理HTTP响应格式
 * @returns 返回包装后的统一响应格式数据流
 */
@Injectable()
export class ResponseInterceptor<T = any> implements NestInterceptor<T, any> {
  constructor(private mode: ResponseMode = 'complex') {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((result: T | { data?: T; msg?: string }) => {
        const statusCode = response.statusCode;
        const isSuccess = statusCode >= 200 && statusCode < 300;

        let data: T | undefined;
        let customMessage: string | undefined;

        if (result && typeof result === 'object' && ('data' in result || 'msg' in result)) {
          data = result.data;
          customMessage = result.msg;
        } else {
          data = result as T;
        }

        const msg = customMessage || this.getStatusMessage(statusCode, isSuccess);

        // 根据模式返回不同结构
        if (this.mode === 'simple') {
          const simpleResponse: { code: number; msg: string; data?: T } = {
            code: statusCode,
            msg,
          };
          if (this.shouldIncludeData(statusCode, data)) {
            simpleResponse.data = data;
          }
          return simpleResponse;
        } else {
          // complex
          const baseResponse: ApiResponse<T> | ApiResponseWithoutData = {
            code: statusCode,
            success: isSuccess,
            msg: customMessage || this.getStatusMessage(statusCode, isSuccess),
            timestamp: new Date().toISOString(),
            path: request.url,
          };

          if (this.shouldIncludeData(statusCode, data)) {
            return { ...baseResponse, data };
          }

          return baseResponse;
        }
      }),
    );
  }

  private shouldIncludeData(statusCode: number, data: any): boolean {
    if (statusCode === HttpStatus.NO_CONTENT) return false;
    if (data === null || data === undefined) return false;
    return true;
  }

  private getStatusMessage(statusCode: number, isSuccess: boolean): string {
    if (STATUS_MESSAGES[statusCode]) return STATUS_MESSAGES[statusCode];
    return isSuccess ? '操作成功' : '操作失败';
  }
}
