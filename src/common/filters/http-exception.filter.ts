import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch() // 不指定异常类型，捕获所有异常
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    // 判断是否为 HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = (exceptionResponse as { message?: string }).message ?? message;
      }
    } else if (exception instanceof Error) {
      // 处理普通 Error
      message = exception.message;

      // 可以根据具体错误类型进行处理
      // 例如 Prisma 错误
      if (exception.name === 'PrismaClientKnownRequestError') {
        message = '数据库操作失败';
      }
    }

    this.logger.error(exception);

    // 开发环境可以打印错误堆栈
    if (process.env.NODE_ENV === 'development') {
      console.error('Exception caught:', exception);
    }

    const errorResponse = {
      code: status,
      message,
    };

    response.send(errorResponse);
  }
}
