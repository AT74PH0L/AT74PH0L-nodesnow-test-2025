import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  declare title: string;

  @IsString()
  @IsOptional()
  declare description?: string;

  @IsEnum(Status)
  @IsOptional()
  declare status?: Status;
}
