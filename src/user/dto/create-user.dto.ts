import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  declare email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 12)
  @IsStrongPassword()
  declare password: string;
}
