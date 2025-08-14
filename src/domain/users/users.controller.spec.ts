import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './users.controller';

describe('UsersController', () => {
  let usersController: UsersController;

  const mockUsersService = {
    createUser: jest.fn(),
    confirmAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockUsersService.createUser.mockResolvedValue('user-token');

      const result = await usersController.createUser(createUserDto);

      expect(result).toEqual({
        message: 'User created successfully',
        status: 'success',
      });
      expect(mockUsersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('confirmUser', () => {
    it('should confirm a user successfully', async () => {
      const confirmUserDto = { token: 'confirmation-token' };

      mockUsersService.confirmAccount.mockResolvedValue(undefined);

      await usersController.confirmUser(confirmUserDto);

      expect(mockUsersService.confirmAccount).toHaveBeenCalledWith({
        token: 'confirmation-token',
      });
    });
  });
});
