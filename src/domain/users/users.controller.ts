import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
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
  firstName: string;

  @IsString()
  lastName: string;
}

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/account/create')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() body: CreateUserDto) {
    const { firstName, lastName, email, password } = body;

    try {
      await this.usersService.createUser({
        firstName,
        lastName,
        email,
        password,
      });
    } catch (error) {
      console.log('Error creating user:', error);
      throw error;
    }

    return {
      message: 'User created successfully',
      status: 'success',
    };
  }

  @Post('/account/confirm-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  async confirmUser(@Body() body: { token: string }) {
    try {
      await this.usersService.confirmAccount({ token: body.token });
    } catch (error) {
      console.log('Error confirming user:', error);
      throw error;
    }
  }
}
