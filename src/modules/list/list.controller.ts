import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageQueryDto } from '@/common/dto';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

@ApiTags('基础列表')
@ApiBearerAuth('Authorization')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: '新增' })
  @ApiBody({ type: CreateListDto })
  async create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  @ApiOperation({ summary: '获取列表' })
  async findAll(@Query() query: PageQueryDto) {
    const data = await this.listService.findAll(query);
    return data;
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单条' })
  async findOne(@Param('id') id: string) {
    return this.listService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: '修改' })
  async update(@Body() updateListDto: UpdateListDto) {
    return this.listService.update(updateListDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  async remove(@Param('id') id: string) {
    return this.listService.remove(+id);
  }
}
