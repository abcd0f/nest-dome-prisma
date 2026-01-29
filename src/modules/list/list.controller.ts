import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateListDto } from './dto/create-list.dto';
import { ListQueryDto } from './dto/query.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

/**
 * 基础列表
 */
@ApiTags('基础列表')
@ApiBearerAuth('Authorization')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /** 新增 */
  @Post()
  async create(@Body() createListDto: CreateListDto) {
    console.log('createListDto', createListDto);

    return this.listService.create(createListDto);
  }

  /** 获取列表 */
  @Get()
  async findAll(@Query() query: ListQueryDto) {
    const data = await this.listService.findAll(query);
    return data;
  }

  /** 获取单条 */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.listService.findOne(+id);
  }

  /** 修改单条 */
  @Patch()
  async update(@Body() updateListDto: UpdateListDto) {
    return this.listService.update(updateListDto);
  }

  /** 删除单条 */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.listService.remove(+id);
  }
}
