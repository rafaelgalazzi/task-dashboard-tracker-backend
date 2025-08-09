import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DatabaseModule } from 'src/adapters/database.module';
import { HashModule } from 'src/adapters/hash.module';
import { UsersRepository } from './users.repository';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, HashModule],
      controllers: [UsersController],
      providers: [UsersService, UsersRepository],
      exports: [UsersRepository],
    }).compile();

    usersController = app.get<UsersController>(UsersController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(usersController.getHello()).toBe('Hello World!');
    });
  });
});
