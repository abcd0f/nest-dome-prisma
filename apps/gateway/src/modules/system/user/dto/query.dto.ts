import { PageQueryDto } from '@nest-app/common';
import { Status } from '@orm/generated/prisma/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UserQueryDto extends PageQueryDto {
  @IsString({ message: '关键词必须是字符串' })
  @IsOptional()
  keyword?: string;

  @IsEnum(Status, { message: '状态必须是 ACTIVE、INACTIVE 或 BANNED' })
  @IsOptional()
  status?: Status;

  @IsString({ message: '邮箱必须是字符串' })
  @IsOptional()
  email?: string;

  @IsString({ message: '手机号必须是字符串' })
  @IsOptional()
  phone?: string;
}
