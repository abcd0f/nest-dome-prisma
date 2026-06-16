import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateListDto } from './dto/create-list.dto';
import { ListQueryDto } from './dto/query.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

@ApiTags('基础列表')
@ApiBearerAuth('Authorization')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  async findAll(@Query() query: ListQueryDto) {
    return this.listService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.listService.findOne(+id);
  }

  @Patch()
  async update(@Body() updateListDto: UpdateListDto) {
    return this.listService.update(updateListDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.listService.remove(+id);
  }
}
