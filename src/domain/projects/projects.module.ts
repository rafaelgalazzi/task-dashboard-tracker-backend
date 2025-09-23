import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/adapters/database.module';
import { UsersRepository } from '../users/users.repository';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersRepository, ProjectsRepository],
  exports: [ProjectsRepository],
})
export class ProjectModule {}
