import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ListModule } from './list/list.module';
import { OperationLogModule } from './operation-log/operation-log.module';

@Module({
  imports: [HealthModule, ListModule, OperationLogModule],
})
export class SystemModule {}
