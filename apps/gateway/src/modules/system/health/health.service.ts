import { PrismaService } from '@nest-app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  async check() {
    const dbStatus = await this.checkDatabase();

    return {
      status: dbStatus === 'up' ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      details: {
        database: { status: dbStatus },
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
