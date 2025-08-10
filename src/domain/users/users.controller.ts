import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { IsString, IsEmail, MinLength } from 'class-validator';
import { Public } from '../../common/decoratos/public.decorator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;
}

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getHello(): string {
    return this.usersService.getHello();
  }

  @Post('/account/create')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    const { name, email, password } = body;

    try {
      await this.usersService.createUser(name, email, password);
    } catch (error) {
      console.log('Error creating user:', error);
      throw error;
    }

    return {
      message: 'User created successfully',
      status: 'success',
    };
  }
}
