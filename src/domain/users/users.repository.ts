import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DrizzleType } from 'src/adapters/database.module';
import { DRIZZLE } from 'src/adapters/database.module';
import { email_verification_tokens, NewUser, User, users, UserWithoutPassword } from 'src/adapters/schema';
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
      return result.length === 0 ? null : this.formatUserWithoutPassword(result[0]);
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw new DatabaseError('Error finding user by email');
    }
  }

  async createEmailVerificationToken(form: { token: string; userId: number; expiresAt: Date }): Promise<void> {
    try {
      await this.db.insert(email_verification_tokens).values(form);
    } catch (error) {
      console.error('Error creating email verification token:', error);
      throw new DatabaseError('Error creating email verification token');
    }
  }

  async verifyConfirmUserToken(form: { token: string }): Promise<UserWithoutPassword> {
    try {
      const token = await this.db
        .select()
        .from(email_verification_tokens)
        .where(eq(email_verification_tokens.token, form.token))
        .limit(1);

      if (token.length === 0) throw new Error('Token not found');

      if (token[0].expiresAt < new Date()) throw new Error('Token expired');

      const user = await this.db.select().from(users).where(eq(users.id, token[0].userId)).limit(1);

      if (user.length === 0) throw new Error('User not found');

      await this.db
        .update(email_verification_tokens)
        .set({ consumedAt: new Date() })
        .where(eq(email_verification_tokens.id, token[0].id));

      return this.formatUserWithoutPassword(user[0]);
    } catch (error) {
      console.error('Error verifying token:', error);
      throw new DatabaseError('Error verifying token');
    }
  }

  async update(user: UserWithoutPassword) {
    try {
      await this.db
        .update(users)
        .set({
          firstName: user.lastName,
          email: user.email,
          isConfirmed: user.isConfirmed,
          hasTwoFactorAuth: user.hasTwoFactorAuth,
        })
        .where(eq(users.id, user.id));
    } catch (error) {
      console.error('Error updating user:', error);
      throw new DatabaseError('Error updating user');
    }
  }

  formatUserWithoutPassword(user: User): UserWithoutPassword {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isConfirmed: user.isConfirmed,
      hasTwoFactorAuth: user.hasTwoFactorAuth,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
