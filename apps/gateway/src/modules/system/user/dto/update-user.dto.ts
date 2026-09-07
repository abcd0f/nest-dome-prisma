import { PartialType } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsInt()
  @Min(1)
  id!: number;
}
