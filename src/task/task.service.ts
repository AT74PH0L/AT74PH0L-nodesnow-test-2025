import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from './entities/task.entity';
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly userService: UserService,
    @InjectModel(Task) private readonly taskRepository: typeof Task,
  ) {}

  async createTask(id: string, createTaskDto: CreateTaskDto) {
    const user = await this.userService.findUserById(id);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    const taskData = { ...createTaskDto, userId: id };
    const result = await this.taskRepository.create(taskData);
    return result;
  }

  async findAll() {
    const tasks = await this.taskRepository.findAll();
    return tasks;
  }

  async findTaskById(id: string) {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new Error('TASK_NOT_FOUND');
    }
    return task;
  }

  async removeTask(id: string) {
    const task = await this.findTaskById(id);
    return await task.destroy();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.findTaskById(id);
    return task.update(updateTaskDto);
  }
}
