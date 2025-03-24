import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsNotEmpty()
  @IsString()
  declare title: string;

  declare description: string;

  @IsEnum(Status)
  @IsNotEmpty()
  declare status: Status;
}
