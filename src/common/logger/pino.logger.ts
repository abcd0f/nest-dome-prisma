import fs from 'node:fs';
import path from 'node:path';
import { LoggerService } from '@nestjs/common';
import pino from 'pino';

import { isDev } from '@/utils/globalenv.utils';

export interface PinoLoggerOptions {
  enableConsole?: boolean;
  logDir?: string;
  level?: pino.Level;
  maxFiles?: number;
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getLogFileName(level: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `${level}-${date}.log`;
}

function createFileDestination(logDir: string, level: string) {
  ensureDir(logDir);
  const fileName = getLogFileName(level);
  const filePath = path.join(logDir, fileName);
  return pino.destination({ dest: filePath, flags: 'a' });
}

function createPinoLogger(options: PinoLoggerOptions = {}): pino.Logger {
  const { enableConsole, logDir = path.resolve(process.cwd(), 'logs'), level = isDev ? 'debug' : 'info' } = options;

  const showConsole = enableConsole !== false;
  const appFileDestination = createFileDestination(logDir, 'app');
  const errorFileDestination = createFileDestination(logDir, 'error');

  const baseOptions: pino.LoggerOptions = {
    level,
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label: string) => ({ level: label.toUpperCase() }),
    },
    serializers: {
      err: pino.stdSerializers.err,
    },
  };

  const streams: pino.StreamEntry[] = [
    ...(showConsole ? [{ level: 'info' as pino.Level, stream: process.stdout } as pino.StreamEntry] : []),
    { level: 'info' as pino.Level, stream: appFileDestination },
    { level: 'error' as pino.Level, stream: errorFileDestination },
  ];

  return pino(baseOptions, pino.multistream(streams));
}

export class PinoLogger implements LoggerService {
  private readonly logger: pino.Logger;

  constructor(options?: PinoLoggerOptions) {
    this.logger = createPinoLogger(options);
  }

  log(message: string, context?: string): void {
    this.logger.info({ context }, message);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error({ context, trace }, message);
  }

  warn(message: string, context?: string): void {
    this.logger.warn({ context }, message);
  }

  debug(message: string, context?: string): void {
    this.logger.debug({ context }, message);
  }

  verbose(message: string, context?: string): void {
    this.logger.trace({ context }, message);
  }
}
