import { Gender, Status } from '@orm/generated/prisma/enums';
import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@/common/dto';

export class ListResponseDto extends BaseEntityDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  status: Status;

  @Expose()
  tags: string[];

  @Expose()
  metadata: any;

  @Expose()
  score: number;

  @Expose()
  balance: string;

  @Expose()
  gender: Gender;

  @Expose()
  phone: string;

  @Expose()
  deleted: boolean;
}
