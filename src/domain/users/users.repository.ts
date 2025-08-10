import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { NewUser, User, users, UserWithoutPassword } from 'src/adapters/schema';
import { DatabaseError } from 'src/common/erros/database.error';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: DrizzleType,
  ) {}

  async create(user: NewUser): Promise<UserWithoutPassword> {
    try {
      const result = await this.db.insert(users).values(user).returning();
      return this.formatUserWithoutPassword(result[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new DatabaseError('Error creating user');
    }
  }

  async findByEmail(email: string): Promise<UserWithoutPassword | null> {
    try {
      const result = await this.db
        .select()
        .from(users)
        .where(and(eq(users.email, email), isNull(users.deletedAt)))
        .limit(1);
      return result.length === 0
        ? null
        : this.formatUserWithoutPassword(result[0]);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new DatabaseError('Error finding user by email');
    }
  }

  formatUserWithoutPassword(user: User): UserWithoutPassword {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
