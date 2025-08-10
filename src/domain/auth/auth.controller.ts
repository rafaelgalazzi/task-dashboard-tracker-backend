import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Public } from '../../common/decoratos/public.decorator';
import { User } from '../../common/decoratos/user.decorator';
import { JwtPayload } from 'src/common/types/auth.types';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getHello(): string {
    return this.authService.getHello();
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getMe(@User() user: JwtPayload) {
    if (!user) throw new UnauthorizedException('User not found');

    try {
      const findUser = await this.authService.getUser(user);
      return { user: findUser };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  @Post('/login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { email, password } = body;
    try {
      const token = await this.authService.login(email, password);
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
    res.send({ message: 'Login successful', status: 'success' });
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res() res: Response) {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    res.send({ message: 'Logout successful', status: 'success' });
  }
}
