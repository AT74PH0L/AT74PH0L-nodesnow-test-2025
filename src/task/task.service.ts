import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task) private readonly taskRepository: typeof Task,
  ) {}

  async create(id: string, createTaskDto: CreateTaskDto) {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    const taskData = { ...createTaskDto, userId: id };
    const result = await this.taskRepository.create(taskData);

    return { message: 'Create task successfully', result };
  }

  async findAll() {
    const tasks = await this.taskRepository.findAll();
    if (!tasks || tasks.length === 0) {
      throw new HttpException('Task is empty', HttpStatus.NO_CONTENT);
    }
    return tasks;
  }

  async findTaskById(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findTaskById(id);
    if (!task) {
      return { message: "Can't update id", id };
    }
    void task.update(updateTaskDto);
    return { message: `Update successfully` };
  }

  async remove(id: string) {
    const task = await this.findTaskById(id);
    if (!task) {
      return { message: "Can't delete id", id };
    }
    await task.destroy();
    return { message: `Delete successfully` };
  }
}
