import { LoggerService } from '@nestjs/common';
import dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';
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
    const loggerTransports: any[] = [];

    // 控制台传输器
    if (this.config.enableConsole) {
      loggerTransports.push(
        new transports.Console({
          level: this.config.level,
          format: format.combine(
            format.colorize(),
            format.timestamp(),
            format.printf(({ level, message, timestamp, context, ...meta }) => {
              const time = dayjs(timestamp as string).format(
                'YYYY-MM-DD HH:mm:ss',
              );
              const contextStr = context ? `[${context}]` : '';
              const metaStr = Object.keys(meta).length
                ? ` ${JSON.stringify(meta)}`
                : '';
              return `\x1B[32m[NEST]\x1B[39m ${time} ${level} ${contextStr} ${message}${metaStr}`;
            }),
          ),
        }),
      );
    }

    // 文件传输器
    if (this.config.enableFile) {
      // 综合日志文件 (info 及以上)
      loggerTransports.push(
        new transports.DailyRotateFile({
          level: 'info',
          dirname: this.config.logDir,
          filename: 'application-%DATE%.log',
          datePattern: this.config.datePattern,
          maxSize: this.config.maxSize,
          maxFiles: this.config.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
        }),
      );

      // 错误日志文件 (error 级别)
      loggerTransports.push(
        new transports.DailyRotateFile({
          level: 'error',
          dirname: this.config.logDir,
          filename: 'error-%DATE%.log',
          datePattern: this.config.datePattern,
          maxSize: this.config.maxSize,
          maxFiles: this.config.maxFiles,
          format: format.combine(format.timestamp(), format.json()),
        }),
      );
    }

    return createLogger({
      level: this.config.level,
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }), // 自动处理错误堆栈
        format.json(),
      ),
      transports: loggerTransports,
      // 处理未捕获的异常和拒绝
      exceptionHandlers: this.config.enableFile
        ? [
            new transports.DailyRotateFile({
              dirname: this.config.logDir,
              filename: 'exceptions-%DATE%.log',
              datePattern: this.config.datePattern,
              maxSize: this.config.maxSize,
              maxFiles: this.config.maxFiles,
            }),
          ]
        : [],
      rejectionHandlers: this.config.enableFile
        ? [
            new transports.DailyRotateFile({
              dirname: this.config.logDir,
              filename: 'rejections-%DATE%.log',
              datePattern: this.config.datePattern,
              maxSize: this.config.maxSize,
              maxFiles: this.config.maxFiles,
            }),
          ]
        : [],
    });
  }

  // NestJS LoggerService 接口方法
  log(message: any, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: any, trace?: string, context?: string): void {
    this.logger.error(message, { context, trace });
  }

  warn(message: any, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: any, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: any, context?: string): void {
    this.logger.verbose(message, { context });
  }

  // 扩展方法
  info(message: any, context?: string, meta?: Record<string, any>): void {
    this.logger.info(message, { context, ...meta });
  }

  // 性能监控日志
  logPerformance(operation: string, duration: number, context?: string): void {
    this.logger.info(`性能监控: ${operation}`, {
      context: context || '性能监控',
      operation,
      duration,
      timestamp: Date.now(),
    });
  }
}

// 使用示例和工厂函数
export class LoggerFactory {
  private static instance: CustomLogger;

  static createLogger(config?: LoggerConfig): CustomLogger {
    return new CustomLogger(config);
  }

  static getInstance(config?: LoggerConfig): CustomLogger {
    if (!LoggerFactory.instance) {
      LoggerFactory.instance = new CustomLogger(config);
    }
    return LoggerFactory.instance;
  }

  // 为不同环境创建预配置的logger
  static createDevelopmentLogger(): CustomLogger {
    return new CustomLogger({
      level: 'debug',
      enableFile: false,
      enableConsole: true,
    });
  }

  static createProductionLogger(): CustomLogger {
    return new CustomLogger({
      level: 'info',
      enableFile: true,
      enableConsole: false,
      datePattern: 'YYYY-MM-DD',
      maxSize: '50m',
      maxFiles: '30d',
    });
  }

  static createTestLogger(): CustomLogger {
    return new CustomLogger({
      level: 'error',
      enableFile: false,
      enableConsole: false,
    });
  }
}

// 装饰器：自动记录方法执行时间
export function LogExecution(context?: string) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor,
  ) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const logger = LoggerFactory.getInstance();
      const start = Date.now();
      const ctx = context || `${target.constructor.name}.${propertyName}`;

      try {
        logger.debug(`Starting ${propertyName}`, ctx);
        const result = await method.apply(this, args);
        const duration = Date.now() - start;
        logger.logPerformance(propertyName, duration, ctx);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        logger.error(
          `Error in ${propertyName}: ${error.message}`,
          error.stack,
          ctx,
        );
        logger.logPerformance(propertyName, duration, ctx);
        throw error;
      }
    };
  };
}
