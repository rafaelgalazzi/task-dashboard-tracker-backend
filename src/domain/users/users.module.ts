import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/adapters/database.module';
import { HashModule } from 'src/adapters/hash.module';
import { UsersRepository } from './users.repository';
import { EmailModule } from 'src/common/email/email.module';
import { HbsModule } from 'src/common/email/handlebars.module';

@Module({
  imports: [DatabaseModule, HashModule, EmailModule, HbsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository],
})
export class UsersModule {}
