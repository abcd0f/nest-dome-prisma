import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Prisma } from '@orm/generated/prisma/client';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    /** 1️⃣ 业务异常（直接透传） */
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      this.logger.error(res);

      return response.status(status).send(typeof res === 'object' ? res : { code: status, message: res });
    }

    /** 2️⃣ Prisma 已知异常 → 翻译成 HttpException */
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const httpException = mapPrismaErrorToHttp(exception);

      this.logger.error({
        code: exception.code,
        meta: exception.meta,
      });

      const status = httpException.getStatus();
      const res = httpException.getResponse();

      return response.status(status).send({
        code: status,
        message: res,
      });
    }

    /** 3️⃣ 其他系统异常 */
    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '服务器内部错误',
    });
  }
}

function mapPrismaErrorToHttp(exception: Prisma.PrismaClientKnownRequestError) {
  switch (exception.code) {
    case 'P2025':
      return new HttpException('数据不存在', HttpStatus.NOT_FOUND);

    case 'P2002':
      return new HttpException('数据已存在，违反唯一约束', HttpStatus.CONFLICT);

    case 'P2003':
      return new HttpException('关联数据不存在', HttpStatus.BAD_REQUEST);

    default:
      return new HttpException('数据库操作失败', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
