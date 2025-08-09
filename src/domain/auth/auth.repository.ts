import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { User, users } from 'src/adapters/schema';
import { DatabaseError } from 'src/erros/database.error';

@Injectable()
export class AuthRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  async findByEmailWithPassword(email: string): Promise<User | null> {
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
