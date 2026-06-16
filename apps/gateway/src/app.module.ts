import config from '@nest-app/config';
import { TimeoutInterceptor } from '@nest-app/core';
import { PrismaModule } from '@nest-app/database';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './modules/health/health.module';

import { ListModule } from './modules/list/list.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ToolsModule } from './modules/tools/tools.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    PrismaModule,

    SharedModule,
    HealthModule,
    ListModule,
    ToolsModule,
    MonitorModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
