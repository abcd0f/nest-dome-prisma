import { PartialType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { CreateListDto } from './create-list.dto';

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsNumber()
  id!: number;
}
