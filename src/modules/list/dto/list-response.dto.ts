import { Gender, Status } from '@orm/generated/prisma/enums';
import { Expose } from 'class-transformer';
import { BaseEntityDto } from '@/common/dto';

export class ListResponseDto extends BaseEntityDto {
  /** id */
  @Expose()
  id: number | undefined;

  /** 邮箱 */
  @Expose()
  email: string | undefined;

  /** 昵称 */
  @Expose()
  name: string | undefined;

  /** 状态 */
  @Expose()
  status: Status | undefined;

  /** 标签 */
  @Expose()
  tags: string[] | undefined;

  /** 元数据 */
  @Expose()
  metadata: any | undefined;

  /** 积分 */
  @Expose()
  score: number | undefined;

  /** 金额 */
  @Expose()
  balance: string | undefined;

  /** 性别 */
  @Expose()
  gender: Gender | undefined;

  /** 手机 */
  @Expose()
  phone: string | undefined;

  /** 删除状态 */
  @Expose()
  deleted: boolean | undefined;
}
