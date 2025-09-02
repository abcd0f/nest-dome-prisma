import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/database.module';

import { ListService } from './list.service';
import { ListController } from './list.controller';

@Module({
  imports: [PrismaModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
