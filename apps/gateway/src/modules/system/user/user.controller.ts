import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('系统管理-用户')
@ApiBearerAuth('Authorization')
@Controller('system/users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.users.create(createUserDto);
  }

  @Get()
  findAll(@Query() query: UserQueryDto) {
    return this.users.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.users.findOne(id);
  }

  @Patch()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.users.update(updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
