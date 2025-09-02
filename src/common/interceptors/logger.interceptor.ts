import { LoggerService } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

export class CustomLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'http',
      format: format.combine(format.timestamp(), format.json()),
      transports: [
        // 控制台输出，便于开发调试
        new transports.Console({
          level: 'http',
          format: format.combine(
            format.colorize(), // 为控制台日志添加颜色
            format.printf(({ level, message, timestamp, context }) => {
              return `${timestamp} [${level}] [${context}] ${message}`;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'warn',
          dirname: 'log',
          filename: 'log-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH-mm',
          maxSize: '5m',
          maxFiles: '14d',
        }),
      ],
    });
  }

  log(message: string, context: string) {
    this.logger.log('info', `[${context}] ${message}`);
  }

  error(message: string, context: string) {
    this.logger.log('error', `[${context}] ${message}`);
  }

  warn(message: string, context: string) {
    this.logger.log('warn', `[${context}] ${message}`);
  }
  debug(message: string, context: string) {
    this.logger.log('debug', `[${context}] ${message}`);
  }
  verbose(message: string, context: string) {
    this.logger.log('verbose', `[${context}] ${message}`);
  }
  silly(message: string, context: string) {
    this.logger.log('silly', `[${context}] ${message}`);
  }
  http(message: string, context: string) {
    this.logger.log('fatal', `[${context}] ${message}`);
  }
}
