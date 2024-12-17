import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private jwtService: JwtService,
  ) {}

  async createTask(
    accessToken: string,
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const user = await this.jwtService.decode(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized - User is not logged in');
    }

    const newTask = new this.taskModel({
      ...createTaskDto,
      status: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await newTask.save();
  }

  async getTasks(accessToken: string): Promise<Task[]> {
    const user = await this.jwtService.decode(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized - User is not logged in');
    }

    return await this.taskModel.find().exec();
  }

  async getTaskById(accessToken: string, taskId: string): Promise<Task> {
    const user = await this.jwtService.decode(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized - User is not logged in');
    }

    const task = await this.taskModel.findById(taskId).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async updateTask(
    accessToken: string,
    taskId: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.getTaskById(accessToken, taskId);

    task.title = updateTaskDto.title || task.title;
    task.description = updateTaskDto.description || task.description;
    task.status = updateTaskDto.status;
    task.completedAt = updateTaskDto.status === true ? new Date() : null;
    task.updatedAt = new Date();

    return await task.save();
  }

  async deleteTask(accessToken: string, taskId: string): Promise<void> {
    const user = await this.jwtService.decode(accessToken);
    if (!user) {
      throw new UnauthorizedException('Unauthorized - User is not logged in');
    }

    const result = await this.taskModel.deleteOne({ _id: taskId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
  }
}
