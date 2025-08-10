import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

@Controller('/task')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return this.tasksService.getHello();
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() body: CreateTaskDto) {
    try {
      const task = await this.tasksService.createTask(body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Task created successfully with ID: ' + task.id,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }
}
