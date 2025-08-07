import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { DatabaseModule } from './adapter/database.module';
import { AuthRepository } from './domain/auth/auth.repository';

@Module({
  imports: [UsersModule, AuthModule, DatabaseModule],
  controllers: [],
  providers: [AuthRepository],
})
export class AppModule {}
