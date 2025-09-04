import { LoggerService } from '@nestjs/common';
import { config, createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

interface LoggerConfig {
  level?: string;
  logDir?: string;
  maxSize?: string;
  maxFiles?: string;
  datePattern?: string;
  enableConsole?: boolean;
  enableFile?: boolean;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

export class CustomLogger implements LoggerService {
  private logger: Logger;
  private readonly config: Required<LoggerConfig>;

  constructor(config: LoggerConfig = {}) {
    // 默认配置
    this.config = {
      level: config.level || 'info',
      logDir: config.logDir || 'logs',
      maxSize: config.maxSize || '20m',
      maxFiles: config.maxFiles || '14d',
      datePattern: config.datePattern || 'YYYY-MM-DD',
      enableConsole: config.enableConsole ?? true,
      enableFile: config.enableFile ?? true,
    };

    this.logger = this.createWinstonLogger();
  }

  private createWinstonLogger(): Logger {
    return createLogger({
      levels: config.npm.levels,
      format: format.combine(
        format.errors({ stack: true }), // 自动处理错误堆栈
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.DailyRotateFile({
          level: this.config.level,
          filename: 'logs/app.%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: this.config.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
          auditFile: 'logs/.audit/app.json',
        }),
        new transports.DailyRotateFile({
          level: LogLevel.ERROR,
          filename: 'logs/app-error.%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxFiles: this.config.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
          auditFile: 'logs/.audit/app-error.json',
        }),
      ],
    });
  }

  // NestJS LoggerService 接口方法
  verbose(message: any, context?: string): void {
    this.logger.log(LogLevel.VERBOSE, message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.log(LogLevel.DEBUG, message, { context });
  }

  log(message: any, context?: string): void {
    this.logger.log(LogLevel.INFO, message, { context });
  }

  warn(message: any, context?: string): void {
    this.logger.log(LogLevel.WARN, message, { context });
  }

  error(message: any, stack?: string, context?: string): void {
    const hasStack = !!context;
    this.logger.log(LogLevel.ERROR, {
      context: hasStack ? context : stack,
      message: hasStack ? new Error(message) : message,
    });
  }
}
