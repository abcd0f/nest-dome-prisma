import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListModule } from './modules/list/list.module';

@Module({
  imports: [ListModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
