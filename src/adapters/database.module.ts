import { Module, Provider, OnModuleInit } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool, Client } from 'pg';
import * as schema from './schema';

export const DRIZZLE = 'DRIZZLE';

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
    return drizzle(pool, { schema });
  },
};

export type DrizzleType = NodePgDatabase<typeof schema>;

@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DatabaseModule implements OnModuleInit {
  async onModuleInit() {
    const client = new Client({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      user: process.env.DB_USER || 'your_username',
      database: process.env.DB_NAME || 'your_database',
      password: process.env.DB_PASSWORD || 'your_password',
    });

    await client.connect();

    // Testa a conexão
    try {
      await client.query('SELECT 1');
      console.log('Drizzle (PostgreSQL) connection established.');
      // await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
      throw new Error('Database connection failed');
    } finally {
      await client.end();
    }
  }
}
