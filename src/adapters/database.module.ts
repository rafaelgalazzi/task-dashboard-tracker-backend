import { Module, Provider } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users, tasks, taskSteps } from './schema';

export const DRIZZLE = 'DRIZZLE';
export type DrizzleType = ReturnType<typeof drizzle>;

export const DrizzleProvider: Provider = {
  provide: DRIZZLE,
  useFactory: async () => {
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || 'your_username',
      database: process.env.DB_NAME || 'your_database',
      password: process.env.DB_PASSWORD || 'your_password',
    });
    try {
      // Testa conexão antes de retornar o drizzle
      await pool.query('SELECT 1');
      console.log('Drizzle (PostgreSQL) connection established.');
    } catch (err) {
      console.error('Failed to connect to the database:', err);
      throw err;
    }
    return drizzle(pool, { schema: { users, tasks, taskSteps } });
  },
};

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DatabaseModule {}
