import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServerService } from './server.service';

@ApiTags('系统监控-服务监控')
@ApiBearerAuth('Authorization')
@Controller('monitor/server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get()
  getInfo() {
    return this.serverService.getInfo();
  }
}
