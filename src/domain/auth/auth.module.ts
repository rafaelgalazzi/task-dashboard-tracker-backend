import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { DatabaseModule } from 'src/adapters/database.module';
import { HashModule } from 'src/adapters/hash.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtService],
  exports: [AuthRepository],
})
export class AuthModule {}
