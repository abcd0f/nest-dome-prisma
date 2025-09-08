import { Module } from '@nestjs/common';

import { PrismaModule } from '@/database/database.module';

import { ListController } from './list.controller';
import { ListService } from './list.service';

@Module({
  imports: [PrismaModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
