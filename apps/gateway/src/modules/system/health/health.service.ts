import { PrismaService } from '@nest-app/database';
import { RedisService } from '@nest-app/redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check() {
    const dbStatus = await this.checkDatabase();
    const redisStatus = await this.redis.ping();

    return {
      status: dbStatus === 'up' && redisStatus !== 'down' ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      details: {
        database: { status: dbStatus },
        redis: { status: redisStatus },
        memory: {
          heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
          rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
        },
      },
    };
  }

  private async checkDatabase(): Promise<'up' | 'down'> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'down';
    }
  }
}
