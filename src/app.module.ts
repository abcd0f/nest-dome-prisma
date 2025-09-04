import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import config from '@/config';
import { SharedModule } from '@/shared/shared.module';

import { ListModule } from './modules/list/list.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      // 指定多个 env 文件时，第一个优先级最高
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}`, '.env'],
      load: [...Object.values(config)],
    }),
    SharedModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
