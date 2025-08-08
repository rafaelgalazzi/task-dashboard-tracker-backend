import { Inject, Injectable } from '@nestjs/common';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { NewUser, User, users } from 'src/adapters/schema';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  create(user: NewUser): Promise<User[]> {
    return this.db.insert(users).values(user).returning();
  }
}
