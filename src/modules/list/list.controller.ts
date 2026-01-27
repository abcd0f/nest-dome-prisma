import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PageQueryDto } from '@/common/dto';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  async create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  async findAll(@Query() query: PageQueryDto) {
    const data = await this.listService.findAll(query);
    return data;
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
