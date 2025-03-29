import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('EMAIL_ALREADY_IN_USE');
    }
    const user = await this.userRepository.create({
      email: createUserDto.email,
      password: createUserDto.password,
    });

    const userResponse = {
      id: user.id,
      email: user.email,
    };
    return userResponse;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return user;
  }

  async findUserById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    return user;
  }

  async removeUser(id: string) {
    const user = await this.findUserById(id);
    if (user) {
      return await user.destroy();
    }
    throw new Error('USER_NOT_FOUND');
  }
}

// findAll() {
//   return `This action returns all user`;
// }
// update(id: number) {
//   return `This action updates a #${id} user`;
// }
