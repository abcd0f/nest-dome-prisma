import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OperationLogQueryDto } from './dto/query.dto';
import { OperationLogService } from './operation-log.service';

@ApiTags('系统管理-操作日志')
@ApiBearerAuth('Authorization')
@Controller('system/operation-logs')
export class OperationLogController {
  constructor(private readonly operationLogs: OperationLogService) {}

  @Get()
  findAll(@Query() query: OperationLogQueryDto) {
    return this.operationLogs.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.operationLogs.findOne(id);
  }
}
