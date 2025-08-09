import {
  // ConflictException,
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { IsString, IsEmail, MinLength } from 'class-validator';

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
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    const { name, email, password } = body;

    try {
      await this.usersService.createUser(name, email, password);
    } catch (error) {
      console.log(error);
      console.log('Error creating user:', error);
      // if (error instanceof DrizzleQueryError && error?.code === '23505') {
      //   throw new ConflictException('Email already in use');
      // }
      throw error;
    }

    return {
      message: 'User created successfully',
      status: 'success',
    };
  }
}
