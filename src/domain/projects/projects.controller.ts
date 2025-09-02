import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { JwtPayload } from 'src/common/types/auth.types';
import { User } from 'src/common/decoratos/user.decorator';
import { Project } from 'src/adapters/schema';
import { Type } from 'class-transformer';
import { ProjectsService } from './projects.service';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class ListProjectsDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  perPage?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  orderBy?: keyof Project;
}

@Controller('/project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Body() body: CreateProjectDto, @User() user: JwtPayload) {
    try {
      const createProject = await this.projectsService.createProject({
        userId: Number(user.sub),
        tilte: body.title,
        description: body.description,
      });

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Project created successfully with ID: ' + createProject.id,
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  @Get('/list')
  @HttpCode(HttpStatus.OK)
  async getProjects(@User() user: JwtPayload, @Param() params: ListProjectsDto) {
    try {
      const projects = await this.projectsService.listProjects({
        userId: Number(user.sub),
        page: params.page,
        perPage: params.perPage,
        search: params.search,
        orderBy: params.orderBy,
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Tasks fetched successfully',
        data: projects,
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }
}
