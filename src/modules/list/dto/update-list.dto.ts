import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateListDto } from './create-list.dto';

export class UpdateListDto extends PartialType(CreateListDto) {
  /** id */
  @IsNumber()
  id: number;
}
