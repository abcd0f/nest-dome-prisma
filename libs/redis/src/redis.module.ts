import { ConfigurationModule } from '@nest-app/config';
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigurationModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
