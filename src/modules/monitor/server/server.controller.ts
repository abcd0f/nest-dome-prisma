import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServerService } from './server.service';

@ApiTags('系统监控-服务监控')
@ApiBearerAuth('Authorization')
@Controller('monitor/server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  /**
   * 获取服务器CPU、内存、系统等监控信息
   */
  @Get()
  getInfo() {
    return this.serverService.getInfo();
  }
}
