import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { IsNumber } from 'class-validator';

export class UpdateListDto extends PartialType(CreateListDto) {
  @IsNumber()
  id: number;
}
