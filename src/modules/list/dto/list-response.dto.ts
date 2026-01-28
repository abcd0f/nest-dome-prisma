import { Gender, Status } from '@orm/generated/prisma/enums';
import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@/shared/dto';

export class ListResponseDto extends BaseEntityDto {
  /** id */
  @Expose()
  id: number;

  /** 邮箱 */
  @Expose()
  email: string;

  /** 昵称 */
  @Expose()
  name: string;

  /** 状态 */
  @Expose()
  status: Status;

  /** 标签 */
  @Expose()
  tags: string[];

  /** 元数据 */
  @Expose()
  metadata: any;

  /** 积分 */
  @Expose()
  score: number;

  /** 金额 */
  @Expose()
  balance: string;

  /** 性别 */
  @Expose()
  gender: Gender;

  /** 手机 */
  @Expose()
  phone: string;

  /** 删除状态 */
  @Expose()
  deleted: boolean;
}
