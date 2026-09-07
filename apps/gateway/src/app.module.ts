import { ConfigurationModule } from '@nest-app/config';
import { TimeoutInterceptor } from '@nest-app/core';
import { PrismaModule } from '@nest-app/database';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MonitorModule } from './modules/monitor/monitor.module';
import { SystemModule } from './modules/system/system.module';
import { ToolModule } from './modules/tool/tool.module';

@Module({
  imports: [
    ConfigurationModule,

    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 3 },
      { name: 'medium', ttl: 10000, limit: 20 },
      { name: 'long', ttl: 60000, limit: 100 },
    ]),

    PrismaModule,

    SystemModule,
    MonitorModule,
    ToolModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_INTERCEPTOR, useFactory: () => new TimeoutInterceptor(15 * 1000) },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
