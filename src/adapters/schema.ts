import { pgTable, serial, varchar, integer, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';

export type User = InferSelectModel<typeof users>;
export type UserWithoutPassword = Omit<User, 'password'>;
export type NewUser = InferInsertModel<typeof users>;

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  isConfirmed: boolean('is_confirmed').notNull().default(false),
  hasTwoFactorAuth: boolean('has_two_factor_auth').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }).notNull(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export type TaskStep = InferSelectModel<typeof taskSteps>;
export type NewTaskStep = InferInsertModel<typeof taskSteps>;

export enum StepStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
}

export const statusEnum = pgEnum('status', [
  StepStatus.PENDING,
  StepStatus.IN_PROGRESS,
  StepStatus.COMPLETED,
  StepStatus.IN_REVIEW,
  StepStatus.APPROVED,
  StepStatus.REJECTED,
  StepStatus.CANCELED,
]);

export const taskSteps = pgTable('task_steps', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }).notNull(),
  status: statusEnum('status').notNull().default(StepStatus.PENDING),
  taskId: integer('task_id')
    .references(() => tasks.id)
    .notNull(),
  startDateTime: timestamp('start_datetime', { withTimezone: true }),
  endDateTime: timestamp('end_datetime', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
});

export const tasksRelations = relations(tasks, ({ many }) => ({
  steps: many(taskSteps),
}));

export const taskStepsRelations = relations(taskSteps, ({ one }) => ({
  task: one(tasks, { fields: [taskSteps.taskId], references: [tasks.id] }),
}));

export const email_verification_tokens = pgTable('email_verification_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  attempts: integer('attempts').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const two_factor_auth_tokens = pgTable('two_factor_auth_tokens', {
  id: serial('id').primaryKey(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  consumedAt: timestamp('consumed_at', { withTimezone: true }),
  attempts: integer('attempts').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
