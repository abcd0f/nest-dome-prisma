import { DateFormat } from '@nest-app/common';
import { Status } from '@orm/generated/prisma/enums';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Expose()
  nickname!: string | null;

  @Expose()
  email!: string | null;

  @Expose()
  phone!: string | null;

  @Expose()
  status!: Status;

  @Expose()
  remark!: string | null;

  @Expose()
  @DateFormat()
  createTime!: Date;

  @Expose()
  @DateFormat()
  updateTime!: Date | null;
}
