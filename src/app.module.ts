import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersModule } from './domain/users/users.module';
import { AuthModule } from './domain/auth/auth.module';
import { DatabaseModule } from './adapters/database.module';
import { AuthRepository } from './domain/auth/auth.repository';
import { HashModule } from './adapters/hash.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/allExceptions.filter';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TaskModule } from './domain/tasks/tasks.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TaskModule,
    DatabaseModule,
    HashModule,
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
  ],
  controllers: [],
  providers: [
    AuthRepository,
    Reflector,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
