import { PrismaModule } from '@nest-app/database';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { OperationLogController } from './operation-log.controller';
import { OperationLogInterceptor } from './operation-log.interceptor';
import { OperationLogService } from './operation-log.service';

@Module({
  imports: [PrismaModule],
  controllers: [OperationLogController],
  providers: [OperationLogService, { provide: APP_INTERCEPTOR, useClass: OperationLogInterceptor }],
  exports: [OperationLogService],
})
export class OperationLogModule {}
