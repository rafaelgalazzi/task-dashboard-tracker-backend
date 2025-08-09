import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { NewUser, User, users } from 'src/adapters/schema';
import { DatabaseError } from 'src/erros/database.error';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  create(user: NewUser): Promise<User[]> {
    try {
      const result = this.db.insert(users).values(user).returning();
      return result;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new DatabaseError('Error creating user');
    }
  }

  findByEmail(email: string): Promise<User | null> {
    try {
      const result = this.db
        .select()
        .from(users)
        .where(and(eq(users.email, email), isNull(users.deletedAt)))
        .limit(1)
        .then(([user]) => user ?? null);
      return result;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new DatabaseError('Error finding user by email');
    }
  }
}
