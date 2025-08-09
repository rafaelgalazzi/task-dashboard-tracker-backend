import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { DatabaseModule } from './adapters/database.module';
import { AuthRepository } from './domain/auth/auth.repository';
import { HashModule } from './adapters/hash.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/allExceptions.filter';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    HashModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [
    AuthRepository,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
