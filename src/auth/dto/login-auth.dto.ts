import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  declare email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  declare password: string;
}
