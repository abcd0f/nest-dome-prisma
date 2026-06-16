import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@orm/generated/prisma/client';
import { FastifyReply } from 'fastify';

interface ErrorPayload {
  code: number;
  msg: string;
  [key: string]: any;
}

interface FastifyError {
  code: string;
  message: string;
  statusCode?: number;
}

function isFastifyError(error: unknown): error is FastifyError {
  return (
    typeof error === 'object' &&
    error !== null &&
    typeof (error as { code?: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('FST_')
  );
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = normalizePayload(status, exception.getResponse());

      this.logger.error(payload);
      return response.status(status).send(payload);
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const { status, msg } = mapPrismaKnownError(exception);

      this.logger.error({
        code: exception.code,
        meta: exception.meta,
        msg,
      });

      return response.status(status).send({ code: status, msg });
    }

    if (isFastifyError(exception)) {
      const status = typeof exception.statusCode === 'number' ? exception.statusCode : HttpStatus.BAD_REQUEST;
      const msg = exception.message || '请求失败';

      this.logger.error({ code: exception.code, msg });
      return response.status(status).send({ code: status, msg });
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      this.logger.error(exception.message);
      return response.status(HttpStatus.BAD_REQUEST).send({
        code: HttpStatus.BAD_REQUEST,
        msg: '数据库查询参数校验失败',
      });
    }

    if (exception instanceof Prisma.PrismaClientInitializationError) {
      this.logger.error(exception);
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).send({
        code: HttpStatus.SERVICE_UNAVAILABLE,
        msg: '数据库连接失败',
      });
    }

    this.logger.error(exception);
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      msg: '服务器内部错误',
    });
  }
}

function normalizePayload(status: number, res: unknown): ErrorPayload {
  if (typeof res === 'string') {
    return { code: status, msg: res };
  }

  if (res && typeof res === 'object') {
    const { message, msg, statusCode, error, code, ...rest } = res as Record<string, any>;

    const resolvedMsg = msg ?? (Array.isArray(message) ? message.join('; ') : message) ?? error ?? '请求失败';

    const resolvedCode = typeof code === 'number' ? code : typeof statusCode === 'number' ? statusCode : status;

    return { code: resolvedCode, msg: resolvedMsg, ...rest };
  }

  return { code: status, msg: '请求失败' };
}

function mapPrismaKnownError(exception: Prisma.PrismaClientKnownRequestError): { status: number; msg: string } {
  switch (exception.code) {
    case 'P2000':
      return { status: HttpStatus.BAD_REQUEST, msg: '字段值超出允许范围或长度' };

    case 'P2002': {
      const target = (exception.meta?.target as string[] | undefined)?.join(', ');
      return {
        status: HttpStatus.CONFLICT,
        msg: target ? `字段 [${target}] 已存在,违反唯一约束` : '数据已存在,违反唯一约束',
      };
    }

    case 'P2003':
      return { status: HttpStatus.BAD_REQUEST, msg: '关联数据不存在' };

    case 'P2004':
      return { status: HttpStatus.BAD_REQUEST, msg: '数据库约束校验失败' };

    case 'P2005':
    case 'P2006':
      return { status: HttpStatus.BAD_REQUEST, msg: '字段值类型不正确' };

    case 'P2011':
      return { status: HttpStatus.BAD_REQUEST, msg: '必填字段不能为空' };

    case 'P2012':
    case 'P2013':
      return { status: HttpStatus.BAD_REQUEST, msg: '缺少必需字段' };

    case 'P2014':
      return { status: HttpStatus.BAD_REQUEST, msg: '关联数据约束违规' };

    case 'P2016':
      return { status: HttpStatus.BAD_REQUEST, msg: '查询条件错误' };

    case 'P2017':
      return { status: HttpStatus.BAD_REQUEST, msg: '关联记录不存在' };

    case 'P2018':
    case 'P2025':
      return { status: HttpStatus.NOT_FOUND, msg: '数据不存在' };

    case 'P2021':
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, msg: '数据表不存在' };

    case 'P2022':
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, msg: '数据字段不存在' };

    case 'P2023':
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, msg: '数据库内部数据无效' };

    case 'P2024':
      return { status: HttpStatus.SERVICE_UNAVAILABLE, msg: '数据库连接超时' };

    default:
      return { status: HttpStatus.INTERNAL_SERVER_ERROR, msg: '数据库操作失败' };
  }
}
