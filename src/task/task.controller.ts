import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from './authenticated-request.interface';
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateTaskDto,
  ) {
    try {
      const task = await this.taskService.createTask(req.user.id, body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create task successfully',
        data: task,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new BadRequestException('Fail to create task');
      }
    }
  }

  @Get()
  async findAll() {
    const allTask = await this.taskService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: allTask,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const task = await this.taskService.findTaskById(id);
      return { statusCode: HttpStatus.OK, data: task };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    try {
      const newTask = await this.taskService.updateTask(id, updateTaskDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Update task successfully',
        data: newTask,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new BadRequestException('Fail to update task');
      }
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.taskService.removeTask(id);
      return { statusCode: HttpStatus.OK, message: 'Delete task successfully' };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new BadRequestException('Fail to delete task');
      }
    }
  }
}
