import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { toPageDto } from '@/common/dto';
import { paginate } from '@/common/utils';

import { PrismaService } from '@/database/prisma.service';

import { CreateListDto } from './dto/create-list.dto';
import { ListResponseDto } from './dto/list-response.dto';

import { ListQueryDto } from './dto/query.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}
  async create(createListDto: CreateListDto) {
    await this.prisma.list.create({
      data: createListDto,
    });
  }

  async findAll(query: ListQueryDto) {
    const { page, pageSize, orderByColumn, isAsc } = query;

    const data = await paginate(this.prisma.list, { page, pageSize, orderBy: { orderByColumn, isAsc } });

    return toPageDto(ListResponseDto, data);
  }

  async findOne(id: number) {
    const data = await this.prisma.list.findUnique({ where: { id } });

    if (!data) throw new HttpException('没有找到该数据', HttpStatus.NOT_FOUND);

    return data;
  }

  async update(updateListDto: UpdateListDto) {
    const data = await this.prisma.list.update({
      where: { id: updateListDto.id },
      data: updateListDto,
    });

    if (!data) throw new HttpException('修改失败', HttpStatus.INTERNAL_SERVER_ERROR);
    return data;
  }

  async remove(id: number) {
    const data = await this.prisma.list.delete({ where: { id } });
    if (!data) throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);

    return {
      msg: '删除成功',
    };
  }
}
