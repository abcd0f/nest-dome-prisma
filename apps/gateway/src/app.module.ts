import { ConfigurationModule } from '@nest-app/config';
import { TimeoutInterceptor } from '@nest-app/core';
import { PrismaModule } from '@nest-app/database';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './modules/health/health.module';

import { ListModule } from './modules/list/list.module';
import { MonitorModule } from './modules/monitor/monitor.module';
import { ToolsModule } from './modules/tools/tools.module';

@Module({
  imports: [
    ConfigurationModule,

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    PrismaModule,

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
