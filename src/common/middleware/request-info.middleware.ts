import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const ip = req.ip || req.connection.remoteAddress;

    const startTime = Date.now();

    // 响应完成时打印耗时
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      //   console.log(`[REQ] --> ${method} ${originalUrl} | ${ip} | ${res.statusCode} | (${duration}ms)`);

      // ANSI 颜色定义
      const colors = {
        reset: '\x1B[0m',
        red: '\x1B[31m',
        green: '\x1B[32m',
        yellow: '\x1B[33m',
        blue: '\x1B[34m',
        magenta: '\x1B[35m',
        cyan: '\x1B[36m',
        gray: '\x1B[90m',
      };

      // 根据状态码选择颜色
      let statusColor = colors.reset;
      if (res.statusCode >= 500) {
        statusColor = colors.red; // 服务器错误
      } else if (res.statusCode >= 400) {
        statusColor = colors.yellow; // 客户端错误
      } else if (res.statusCode >= 300) {
        statusColor = colors.cyan; // 重定向
      } else if (res.statusCode >= 200) {
        statusColor = colors.green; // 成功
      }

      console.log(
        `${colors.magenta}[REQ]${colors.reset} --> ` +
          `${colors.blue}${method}${colors.reset} ` +
          `${originalUrl} | ` +
          `${colors.gray}${ip}${colors.reset} | ` +
          `${statusColor}${res.statusCode}${colors.reset} | ` +
          `${colors.yellow}${duration}ms${colors.reset}`,
      );
    });

    next();
  }
}
