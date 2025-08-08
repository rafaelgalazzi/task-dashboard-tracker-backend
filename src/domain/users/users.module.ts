import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/adapters/database.module';
import { HashModule } from 'src/adapters/hash.module';

@Module({
  imports: [DatabaseModule, HashModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
