import type { ConfigKeyPaths, IRedisConfig } from '@nest-app/config';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly client: Redis;
  private readonly enabled: boolean;
  private readonly connectTimeout: number;

  constructor(configService: ConfigService<ConfigKeyPaths, true>) {
    const config = configService.get<IRedisConfig>('redis', { infer: true })!;
    this.enabled = config.enabled;
    this.connectTimeout = config.connectTimeout;
    this.client = new Redis({
      host: config.host,
      port: config.port,
      username: config.username || undefined,
      password: config.password || undefined,
      db: config.database,
      keyPrefix: config.keyPrefix || undefined,
      connectTimeout: config.connectTimeout,
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 1000)),
    });
    this.client.on('error', (error) => this.logger.warn(`Redis 连接异常: ${error.message}`));
  }

  async onModuleInit() {
    if (!this.enabled) {
      this.logger.log('Redis 已禁用');
      return;
    }

    try {
      await this.client.connect();
      this.logger.log('Redis 已连接');
    } catch (error) {
      this.logger.warn(`Redis 连接失败，应用继续启动: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async onModuleDestroy() {
    if (this.client.status !== 'end') await this.client.quit();
  }

  getClient() {
    return this.client;
  }

  async ping(): Promise<'up' | 'down' | 'disabled'> {
    if (!this.enabled) return 'disabled';

    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    try {
      await Promise.race([
        this.client.ping(),
        new Promise<never>((_, reject) => {
          timeoutHandle = setTimeout(() => reject(new Error('Redis ping timeout')), this.connectTimeout);
        }),
      ]);
      return 'up';
    } catch {
      return 'down';
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
    }
  }

  get(key: string) {
    return this.client.get(key);
  }

  set(key: string, value: string, ttlSeconds?: number) {
    return ttlSeconds ? this.client.set(key, value, 'EX', ttlSeconds) : this.client.set(key, value);
  }

  del(key: string) {
    return this.client.del(key);
  }
}
