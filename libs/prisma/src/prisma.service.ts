import type { ConfigKeyPaths, IDatabaseConfig } from '@nest-app/config';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@orm/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(configService: ConfigService<ConfigKeyPaths, true>) {
    const db = configService.get<IDatabaseConfig>('database', { infer: true })!;

    super({
      adapter: new PrismaMariaDb({
        host: db.host,
        port: db.port,
        user: db.username,
        password: db.password,
        database: db.database,
        connectionLimit: db.connectionLimit,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('数据库已连接');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('数据库已断开');
  }
}
