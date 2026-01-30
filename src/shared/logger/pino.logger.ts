import fs from 'node:fs';
import path from 'node:path';
import { LoggerService } from '@nestjs/common';
import pino, { Logger, multistream } from 'pino';

/**
 * Pino Logger 配置
 */
interface PinoLoggerOptions {
  /**
   * 是否输出到控制台
   * @default true
   */
  enableConsole?: boolean;

  /**
   * 日志输出目录
   * @default process.cwd()/logs
   */
  logDir?: string;

  /**
   * 最低日志级别
   * @default 'debug'
   */
  level?: pino.Level;
}

/**
 * 确保目录存在
 */
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * 创建底层 Pino Logger
 */
function createPinoLogger(options: PinoLoggerOptions = {}): Logger {
  const { enableConsole = true, logDir = path.resolve(process.cwd(), 'logs'), level = 'debug' } = options;

  ensureDir(logDir);

  const streams: Parameters<typeof multistream>[0] = [];

  if (enableConsole) {
    streams.push({
      level,
      stream: process.stdout,
    });
  }

  streams.push(
    {
      level: 'info',
      stream: fs.createWriteStream(path.join(logDir, 'info.log'), { flags: 'a' }),
    },
    {
      level: 'error',
      stream: fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' }),
    },
  );

  return pino(
    {
      level, // 必须是最低级别
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    multistream(streams),
  );
}

/**
 * NestJS LoggerService 适配器
 */
export class PinoLogger implements LoggerService {
  private readonly logger: Logger;

  constructor(options?: PinoLoggerOptions) {
    this.logger = createPinoLogger(options);
  }

  log(message: any, context?: string) {
    this.logger.info({ context }, message);
  }

  error(message: any, trace?: string, context?: string) {
    this.logger.error({ context, trace }, message);
  }

  warn(message: any, context?: string) {
    this.logger.warn({ context }, message);
  }

  debug(message: any, context?: string) {
    this.logger.debug({ context }, message);
  }

  verbose(message: any, context?: string) {
    this.logger.trace({ context }, message);
  }
}
