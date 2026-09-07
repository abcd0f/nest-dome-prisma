import { paginate, toPageDto } from '@nest-app/common';

import { PrismaService } from '@nest-app/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateListDto } from './dto/create-list.dto';
import { ListResponseDto } from './dto/list-response.dto';
import { ListQueryDto } from './dto/query.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async create(createListDto: CreateListDto) {
    await this.prisma.list.create({ data: createListDto });
  }

  async findAll(query: ListQueryDto) {
    const { page, pageSize, orderByColumn, isAsc } = query;
    const data = await paginate(this.prisma.list, { page, pageSize, orderBy: { orderByColumn, isAsc } });
    return toPageDto(ListResponseDto, data);
  }

  async findOne(id: number) {
    const data = await this.prisma.list.findUnique({ where: { id } });
    if (!data) throw new NotFoundException('没有找到该数据');
    return data;
  }

  async update(updateListDto: UpdateListDto) {
    return this.prisma.list.update({ where: { id: updateListDto.id }, data: updateListDto });
  }

  async remove(id: number) {
    await this.prisma.list.delete({ where: { id } });
    return { msg: '删除成功' };
  }
}
