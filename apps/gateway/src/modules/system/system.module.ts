import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ListModule } from './list/list.module';

@Module({
  imports: [HealthModule, ListModule],
})
export class SystemModule {}
