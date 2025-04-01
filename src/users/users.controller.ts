import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Request,
  BadRequestException,
  NotFoundException,
  Patch,
  Get,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './users.service';
import {
  CreateUserDto,
  CreateUserResponseDto,
  ErrorResponseDto,
  updateUserResponseDto,
  UserDeleteResponseDto,
  UserNotFoundResponseDto,
  UserResponseDto,
} from './dto/create-user.dto';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthenticatedRequest } from 'src/tasks/authenticated-request.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Use to register user' })
  @ApiCreatedResponse({
    description: 'User create success',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Email is already in use',
    type: ErrorResponseDto,
  })
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto | ErrorResponseDto | undefined> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create user successfully',
        data: user,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'EMAIL_ALREADY_IN_USE') {
        throw new BadRequestException('Email already in use');
      }
    }
  }

  @ApiOperation({ summary: 'Use to change password' })
  @ApiCreatedResponse({
    description: 'User create success',
    type: updateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User not found',
    type: UserNotFoundResponseDto,
  })
  @Patch()
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async changePassoword(
    @Request() req: AuthenticatedRequest,
    @Body() body: UpdateUserDto,
  ): Promise<updateUserResponseDto | UserNotFoundResponseDto | undefined> {
    try {
      await this.userService.changePassoword(req.user.id, body);
      return {
        statusCode: HttpStatus.OK,
        message: 'Change password successfully',
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
    }
  }

  @ApiOperation({ summary: 'Use to get details of a specific user' })
  @ApiCreatedResponse({
    description: 'Response specific user',
    type: UserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User not found',
    type: UserNotFoundResponseDto,
  })
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserbyId(
    @Param('id') id: string,
  ): Promise<UserResponseDto | UserNotFoundResponseDto | undefined> {
    try {
      const user = await this.userService.findUserById(id);
      return {
        statusCode: HttpStatus.OK,
        data: user,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
    }
  }

  @ApiOperation({ summary: 'Use to delete a specific user' })
  @ApiCreatedResponse({
    description: 'Response delete success',
    type: UserDeleteResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'User not found',
    type: UserNotFoundResponseDto,
  })
  @Delete(':id')
  @ApiCookieAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Param('id') id: string,
  ): Promise<UserDeleteResponseDto | UserNotFoundResponseDto | undefined> {
    try {
      await this.userService.removeUser(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Delete user successfully',
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
    }
  }
}
