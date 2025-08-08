import { Module } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { DatabaseModule } from './adapters/database.module';
import { AuthRepository } from './domain/auth/auth.repository';
import { HashModule } from './adapters/hash.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    HashModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [AuthRepository],
})
export class AppModule {}
