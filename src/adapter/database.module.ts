import { drizzle } from 'drizzle-orm/node-postgres';
import { Provider, Module } from '@nestjs/common';

export const DRIZZLE = 'DRIZZLE';

export type DrizzleType = ReturnType<typeof drizzle>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  useFactory: () =>
    drizzle({
      connection: {
        host: process.env.DATABASE_URL || 'localhost',
        port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
        user: process.env.DB_USER || 'your_username',
        database: process.env.DB_NAME || 'your_database',
        password: process.env.DB_PASSWORD || 'your_password',
      },
    }),
};

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DatabaseModule {}
