import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
// import { LoginDto } from './dto/login-auth.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  // let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findUserByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'test_token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    // jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user if password is correct', async () => {
      const user = {
        id: 'some-uuid',
        email: 'test@example.com',
        password: 'aaa', // Plain password before hashing
      };

      // Mocking findUserByEmail
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);

      // Mocking bcrypt.compare to always return true (password is correct)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateUser('test@example.com', 'aaa');
      expect(result).toEqual(user);
    });

    it('should return null if password is incorrect', async () => {
      const user = {
        id: 'some-uuid',
        email: 'test@example.com',
        password: 'aaa', // Plain password before hashing
      };

      // Mocking findUserByEmail
      jest.spyOn(userService, 'findUserByEmail').mockResolvedValue(user);

      // Mocking bcrypt.compare to return false (password is incorrect)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });
  });
});
