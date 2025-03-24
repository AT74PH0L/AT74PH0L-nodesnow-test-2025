import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SequelizeModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create user', () => {
    it('should return the user after create user', async () => {
      const mockUser: CreateUserDto = {
        email: 'mock@mock.com',
        password: 'M0ck123!',
      };
      const expectUser = {
        id: expect.any(String) as string,
        email: 'mock@mock.com',
      };
      const result = await service.create(mockUser);
      expect(result).toMatchObject(expectUser);
    });

    it('should return user is already exist', async () => {
      const mockUser: CreateUserDto = {
        email: 'mock@mock.com',
        password: 'M0ck123!',
      };

      await service.create(mockUser); // สร้าง user ครั้งแรก

      await expect(service.create(mockUser)).rejects(
        'Email already in use',
      );
    });
  });
});
