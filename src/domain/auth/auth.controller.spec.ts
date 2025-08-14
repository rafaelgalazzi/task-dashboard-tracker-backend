import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './auth.controller';
import { UserWithoutPassword } from 'src/adapters/schema';

describe('AuthController', () => {
  let authController: AuthController;

  const mockUser = {
    sub: '1',
    email: 'test@example.com',
  };

  const mockUserWithoutPassword: UserWithoutPassword = {
    id: 1,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    isConfirmed: true,
    hasTwoFactorAuth: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockAuthService = {
    getUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMe', () => {
    it('should return user data successfully', async () => {
      mockAuthService.getUser.mockResolvedValue(mockUserWithoutPassword);

      const result = await authController.getMe(mockUser);

      expect(result).toEqual({ user: mockUserWithoutPassword });
      expect(mockAuthService.getUser).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('login', () => {
    it('should login successfully and set auth cookie', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'jwt-token';
      mockAuthService.login.mockResolvedValue(mockToken);

      // Create a mock response object
      const mockResponse = {
        cookie: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      await authController.login(loginDto, mockResponse);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockResponse.cookie).toHaveBeenCalledWith('auth_token', mockToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Login successful',
        status: 'success',
      });
    });
  });

  describe('logout', () => {
    it('should clear auth cookie successfully', () => {
      // Create a mock response object
      const mockResponse = {
        clearCookie: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      authController.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('auth_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: 'Logout successful',
        status: 'success',
      });
    });
  });
});
