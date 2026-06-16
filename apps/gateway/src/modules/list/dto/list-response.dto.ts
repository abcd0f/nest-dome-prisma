import { BaseEntityDto } from '@nest-app/common';
import { Gender, Status } from '@orm/generated/prisma/enums';
import { Expose } from 'class-transformer';

export class ListResponseDto extends BaseEntityDto {
  @Expose()
  id: number | undefined;

  @Expose()
  email: string | undefined;

  @Expose()
  name: string | undefined;

  @Expose()
  status: Status | undefined;

  @Expose()
  tags: string[] | undefined;

  @Expose()
  metadata: any | undefined;

  @Expose()
  score: number | undefined;

  @Expose()
  balance: string | undefined;

  @Expose()
  gender: Gender | undefined;

  @Expose()
  phone: string | undefined;

  @Expose()
  deleted: boolean | undefined;
}
