import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('UserController', () => {
  let userController: UserController;

  const createUserDto: CreateUserDto = {
    email: 'mock@mock.com',
    password: 'M0ck123!',
  };

  const mockResponse = {
    statusCode: 201,
    message: 'Create user successfully',
    data: {
      id: '1',
      email: 'mock@mock.com',
    },
  };

  const mockUserService = {
    createUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('Create user', () => {
    it('should create a user successfully', async () => {
      mockUserService.createUser.mockResolvedValue(mockResponse.data);

      const result = await userController.create(createUserDto);
      expect(mockUserService.createUser).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const mockResponse = new Error('EMAIL_ALREADY_IN_USE');
      mockUserService.createUser.mockRejectedValue(mockResponse);

      expect(mockUserService.createUser).toHaveBeenCalled();
      await expect(userController.create(createUserDto)).rejects.toThrow(
        new BadRequestException('Email already in use'),
      );
    });
  });

  describe('CreateUserDto Validation', () => {
    it('should pass validation if data is correct', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 'M0ck123!',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if password is empty', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: '',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation if password is not strong', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 'password',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isStrongPassword');
    });

    it('should fail validation if password is less than 8 characters', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 'pass',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation if email is invalid', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'invalid-email',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail validation if email is empty', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: '',
        password: 'M0ck123!',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation if password is not string', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 111111,
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });
});
