import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/adapters/database.module';
import { HashModule } from 'src/adapters/hash.module';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        HashModule,
        UsersModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (cfg: ConfigService) => ({
            secret: cfg.get<string>('JWT_SECRET', ''),
            signOptions: {
              expiresIn: cfg.get<string>('JWT_EXPIRES_IN', '7d'),
            },
          }),
        }),
      ],
      controllers: [AuthController],
      providers: [AuthService, AuthRepository],
      exports: [AuthRepository, JwtModule],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authController.getHello()).toBe('Hello World!');
    });
  });
});
