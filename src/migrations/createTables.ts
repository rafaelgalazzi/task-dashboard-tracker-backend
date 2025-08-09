export function createTablesSQL() {
  return `
    CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "password" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL,
        "deleted_at" timestamptz
    );

    CREATE TABLE IF NOT EXISTS "tasks" (
        "id" serial PRIMARY KEY,
        "title" varchar(255) NOT NULL,
        "description" varchar(1024) NOT NULL,
        "user_id" serial NOT NULL REFERENCES "users"("id"),
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL,
        "deleted_at" timestamptz
    );

    CREATE TABLE IF NOT EXISTS "task_steps" (
        "id" serial PRIMARY KEY,
        "title" varchar(255) NOT NULL,
        "description" varchar(1024) NOT NULL,
        "is_completed" boolean DEFAULT false NOT NULL,
        "task_id" integer NOT NULL REFERENCES "tasks"("id"),
        "start_datetime" timestamptz NOT NULL,
        "end_datetime" timestamptz,
        "created_at" timestamptz DEFAULT now() NOT NULL,
        "updated_at" timestamptz DEFAULT now() NOT NULL,
        "deleted_at" timestamptz
    );
  `;
}
