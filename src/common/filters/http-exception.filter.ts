import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    // 1️⃣ HttpException（ValidationPipe / Auth / Biz）
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();

      this.logger.warn(res);

      // 如果是对象，直接透传（关键）
      if (typeof res === 'object') {
        return response.status(status).send(res);
      }

      // string 情况兜底
      return response.status(status).send({
        code: status,
        message: res,
      });
    }

    // 2️⃣ 非 HttpException（系统级错误）
    let message = '服务器内部错误';

    if (exception instanceof Error) {
      message = exception.message;

      if (exception.name === 'PrismaClientKnownRequestError') {
        message = `数据库操作失败${exception.message}`;
      }
    }

    this.logger.error(exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
    });
  }
}
