import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { ListModule } from './list/list.module';
import { OperationLogModule } from './operation-log/operation-log.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [HealthModule, ListModule, OperationLogModule, UserModule],
})
export class SystemModule {}
