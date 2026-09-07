import { paginate, toDto, toPageDto } from '@nest-app/common';
import { PrismaService } from '@nest-app/database';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/query.dto';
import { UserResponseDto } from './dto/response.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const data = await this.prisma.user.create({ data: createUserDto });
    return toDto(UserResponseDto, data);
  }

  async findAll(query: UserQueryDto) {
    const { page, pageSize, orderByColumn, isAsc, keyword, status, email, phone } = query;
    const data = await paginate(this.prisma.user, {
      page,
      pageSize,
      where: {
        deleted: false,
        ...(keyword
          ? {
              OR: [{ username: { contains: keyword } }, { nickname: { contains: keyword } }],
            }
          : {}),
        ...(status ? { status } : {}),
        ...(email ? { email: { contains: email } } : {}),
        ...(phone ? { phone: { contains: phone } } : {}),
      },
      orderBy: { orderByColumn: orderByColumn ?? 'createTime', isAsc: isAsc ?? 'desc' },
    });
    return toPageDto(UserResponseDto, data);
  }

  async findOne(id: number) {
    const data = await this.prisma.user.findFirst({ where: { id, deleted: false } });
    if (!data) throw new NotFoundException('没有找到该用户');
    return toDto(UserResponseDto, data);
  }

  async update(updateUserDto: UpdateUserDto) {
    const { id, ...data } = updateUserDto;
    const exists = await this.prisma.user.findFirst({ where: { id, deleted: false } });
    if (!exists) throw new NotFoundException('没有找到该用户');

    const updated = await this.prisma.user.update({ where: { id }, data });
    return toDto(UserResponseDto, updated);
  }

  async remove(id: number) {
    const result = await this.prisma.user.updateMany({
      where: { id, deleted: false },
      data: { deleted: true },
    });
    if (result.count === 0) throw new NotFoundException('没有找到该用户');
    return { msg: '删除成功' };
  }
}
