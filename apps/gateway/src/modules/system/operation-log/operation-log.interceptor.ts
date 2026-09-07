import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { defer, from, Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { OperationLogService } from './operation-log.service';

const CONTROLLER_SUFFIX_REGEX = /Controller$/;

function serializeForLog(value: unknown): unknown {
  if (value === undefined) return null;
  if (Buffer.isBuffer(value)) return { type: 'binary', size: value.length };

  try {
    return JSON.parse(JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? item.toString() : item)));
  } catch {
    return String(value);
  }
}

function getUserValue(user: any, ...keys: string[]): string | null {
  if (!user) return null;
  const value = keys.map((key) => user[key]).find((item) => item !== undefined && item !== null);
  return value === undefined || value === null ? null : String(value);
}

@Injectable()
export class OperationLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(OperationLogInterceptor.name);

  constructor(private readonly operationLogs: OperationLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const request = context.switchToHttp().getRequest<FastifyRequest & { user?: any }>();
    const controller = context.getClass()?.name?.replace(CONTROLLER_SUFFIX_REGEX, '') || null;
    const handler = context.getHandler()?.name || null;
    const user = request.user;
    const requestParams = serializeForLog({ body: request.body, query: request.query, params: request.params });

    const base = {
      operateTime: new Date(startedAt),
      ip: request.ip ?? request.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ?? null,
      requestMethod: request.method,
      requestUrl: request.url,
      requestParams,
      module: controller,
      operation: handler,
      userId: getUserValue(user, 'id', 'userId'),
      username: getUserValue(user, 'username', 'userName', 'name'),
      departmentId: getUserValue(user, 'departmentId', 'deptId'),
      departmentName: getUserValue(user, 'departmentName', 'deptName'),
    };

    const save = (responseStatus: number, responseParams: unknown, errorMessage?: string | null) =>
      defer(() =>
        from(
          this.operationLogs.record({
            ...base,
            duration: Date.now() - startedAt,
            responseStatus,
            responseParams: serializeForLog(responseParams),
            errorMessage: errorMessage ?? null,
          }),
        ),
      ).pipe(
        catchError((error) => {
          this.logger.error(`操作日志入库失败: ${error instanceof Error ? error.message : String(error)}`);
          return of(null);
        }),
      );

    return next.handle().pipe(
      mergeMap((response) =>
        save(context.switchToHttp().getResponse().statusCode, response).pipe(mergeMap(() => of(response))),
      ),
      catchError((error) => {
        const response = typeof error?.getResponse === 'function' ? error.getResponse() : { message: error?.message };
        const status = typeof error?.getStatus === 'function' ? error.getStatus() : 500;
        return save(status, response, error?.message).pipe(mergeMap(() => throwError(() => error)));
      }),
    );
  }
}
