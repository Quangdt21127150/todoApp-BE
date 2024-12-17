import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto, UpdateTaskDto } from './task.dto';
import { BearerToken } from '../auth/auth.decorator';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async createTask(
    @BearerToken() accessToken: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.taskService.createTask(accessToken, createTaskDto);
  }

  @Get()
  getTasks(@BearerToken() accessToken: string) {
    return this.taskService.getTasks(accessToken);
  }

  @Get(':id')
  getTaskById(@BearerToken() accessToken: string, @Param('id') taskId: string) {
    return this.taskService.getTaskById(accessToken, taskId);
  }

  @Put(':id')
  async updateTask(
    @BearerToken() accessToken: string,
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.updateTask(accessToken, taskId, updateTaskDto);
  }

  @Delete(':id')
  deleteTask(@BearerToken() accessToken: string, @Param('id') taskId: string) {
    return this.taskService.deleteTask(accessToken, taskId);
  }
}
