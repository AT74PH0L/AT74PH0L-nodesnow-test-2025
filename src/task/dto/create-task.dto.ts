import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  declare title: string;

  @IsOptional()
  @IsString()
  declare description?: string;
}
