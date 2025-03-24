import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: LoginDto): Promise<{ access_token: string }> {
    if (!user) {
      throw new Error('Invalid user data');
    }
    const result = await this.userService.findUserByEmail(user.email);
    if (!result) {
      throw new HttpException('User no found', HttpStatus.BAD_REQUEST);
    }
    const payload = { email: user.email, id: result.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
