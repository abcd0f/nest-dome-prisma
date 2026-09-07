import { Status } from '@orm/generated/prisma/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @MaxLength(64, { message: '用户名长度不能超过 64 个字符' })
  username!: string;

  @IsString({ message: '昵称必须是字符串' })
  @IsOptional()
  @MaxLength(128, { message: '昵称长度不能超过 128 个字符' })
  nickname?: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsOptional()
  email?: string;

  @IsString({ message: '手机号必须是字符串' })
  @IsOptional()
  @MaxLength(20, { message: '手机号长度不能超过 20 个字符' })
  phone?: string;

  @IsEnum(Status, { message: '状态必须是 ACTIVE、INACTIVE 或 BANNED' })
  @IsOptional()
  status?: Status;

  @IsString({ message: '备注必须是字符串' })
  @IsOptional()
  @MaxLength(255, { message: '备注长度不能超过 255 个字符' })
  remark?: string;
}
