import { IsString, IsNotEmpty } from 'class-validator';

export class CreateListDto {
  @IsString({ message: '邮箱必须是字符串' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsString({ message: '昵称必须是字符串' })
  @IsNotEmpty({ message: '昵称不能为空' })
  name: string;
}
