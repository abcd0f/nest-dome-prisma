import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDecimal,
  IsBoolean,
  IsArray,
  IsJSON,
} from 'class-validator';

import { Status, Gender } from '@prisma/generated/prisma';

export class CreateListDto {
  @IsString({ message: '邮箱必须是字符串' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString({ message: '昵称必须是字符串' })
  @IsNotEmpty({ message: '昵称不能为空' })
  name: string;

  @IsEnum(Status, { message: '状态必须是 ACTIVE、INACTIVE 或 BANNED' })
  @IsOptional()
  status?: Status;

  @IsArray({ message: '标签必须是数组' })
  @IsOptional()
  tags?: string[];

  @IsJSON({ message: 'metadata 必须是 JSON 对象' })
  @IsOptional()
  metadata?: Record<string, any>;

  @IsNumber({}, { message: '积分必须是数字' })
  @IsOptional()
  score?: number;

  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: '余额必须是最多两位小数的数字' },
  )
  @IsOptional()
  balance?: string;

  @IsEnum(Gender, { message: '性别必须是 MALE、FEMALE 或 OTHER' })
  @IsOptional()
  gender?: Gender;

  @IsString({ message: '手机号必须是字符串' })
  @IsOptional()
  phone?: string;

  @IsBoolean({ message: 'deleted 必须是布尔值' })
  @IsOptional()
  deleted?: boolean;
}
