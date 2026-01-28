import { Gender, Status } from '@orm/generated/prisma/enums';

import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateListDto {
  /**
   * 邮箱
   * @example wanglt-123@qq.com
   */
  @IsString({ message: '邮箱必须是字符串' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  /**
   * 昵称
   * @example
   */
  @IsString({ message: '昵称必须是字符串' })
  @IsNotEmpty({ message: '昵称不能为空' })
  name: string;

  /**
   * 状态
   * @example
   */
  @IsEnum(Status, { message: '状态必须是 ACTIVE、INACTIVE 或 BANNED' })
  @IsOptional()
  status?: Status;

  /**
   * 标签
   * @example
   */
  @IsArray({ message: '标签必须是数组' })
  @IsOptional()
  tags?: string[];

  /**
   * json对象
   * @example
   */
  @IsObject({ message: 'metadata 必须是对象' })
  @IsOptional()
  metadata?: any;

  /**
   * 积分
   * @example 80
   */
  @IsNumber({}, { message: '积分必须是数字' })
  @IsOptional()
  score?: number;

  /**
   * 金额
   * @example 70.5
   */
  @IsString()
  @IsOptional()
  balance?: string;

  /**
   * 性别
   */
  @IsEnum(Gender, { message: '性别必须是 MALE、FEMALE 或 OTHER' })
  @IsOptional()
  gender?: Gender;

  /**
   * 手机号
   * 458999874
   */
  @IsString({ message: '手机号必须是字符串' })
  @IsOptional()
  phone?: string;
}
