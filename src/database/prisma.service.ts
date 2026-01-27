import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@orm/generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import 'dotenv/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      adapter: new PrismaMariaDb({
        /* 数据库地址  */
        host: process.env.DB_HOST!,
        /* 数据库密码 */
        user: process.env.DB_USERNAME!,
        /* 数据库名称 */
        password: process.env.DB_PASSWORD!,
        /* 数据库端口 */
        database: process.env.DB_DATABASE!,
        /* 数据库连线池数量 */
        connectionLimit: Number(process.env.DB_CONNECTION_LIMIT!),
      }),
      // log: ['query', 'info', 'warn', 'error'], // 开启查询日志，便于调试
      // errorFormat: 'minimal',
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('数据库已连接');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('数据库断开连接');
  }
}
