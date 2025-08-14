import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/adapters/schema.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'your_username',
    database: process.env.DB_NAME || 'your_database',
    password: process.env.DB_PASSWORD || 'your_password',
    ssl: false,
  },
});

// Run the commandond to generate migrations:
// npx drizzle-kit generate --config drizzle.config.ts
// npx drizzle-kit push --config drizzle.config.ts
// To Drop all tables: // await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
