import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/database/database.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}
  async create(createListDto: CreateListDto) {
    await this.prisma.list.create({
      data: createListDto,
    });
  }

  async findAll() {
    const data = await this.prisma.list.findMany();
    return data;
  }

  async findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  async update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  async remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
