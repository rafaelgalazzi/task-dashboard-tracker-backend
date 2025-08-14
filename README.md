# Task Dashboard Tracker Backend

A robust backend API for a task management dashboard built with NestJS, PostgreSQL, and Drizzle ORM.

## Description

This project provides the backend infrastructure for a task tracking dashboard application. It features user authentication, task management capabilities, and a clean API architecture following NestJS best practices.

## Key Features

- User authentication (registration, login, JWT-based sessions)
- Task management (create, read, update, delete tasks)
- Role-based access control
- Email notifications
- PostgreSQL database with Drizzle ORM
- Comprehensive error handling and logging
- API documentation

## Project Setup

### Prerequisites

- Node.js (version 18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Environment Configuration

Create a `.env` file based on the provided `.env.example`:

```bash
cp .env.example .env
```

Then configure the following variables in your `.env` file:

- `APP_PORT`: The port the application will run on
- `DATABASE_URL`: PostgreSQL connection string
- `DB_PORT`: Database port
- `DB_USER`: Database user
- `DB_NAME`: Database name
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: Token expiration time
- `SMTP_HOST`: Email server host
- `SMTP_PORT`: Email server port
- `SMTP_USER`: Email server user
- `SMTP_PASS`: Email server password

### Installation

```bash
# Install dependencies
$ npm install
```

### Database Setup

This project uses Drizzle ORM with PostgreSQL. To set up your database:

1. Ensure your database credentials are configured in `.env`
2. Run the database migrations:
   ```bash
   # Generate migrations
   $ npx drizzle-kit generate --config drizzle.config.ts
   
   # Push schema to database
   $ npx drizzle-kit push --config drizzle.config.ts
   ```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run start:prod

# Build the application
$ npm run build
```

## Testing

```bash
# Unit tests
$ npm run test

# End-to-end tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov

# Type checking
$ npm run type-check
```

## API Documentation

The API follows REST conventions and includes comprehensive error handling. Detailed API documentation can be found at `/api/docs` when the server is running.

## Project Structure

```
src/
├── adapters/          # Database adapters and configurations
├── common/            # Shared utilities, filters, guards, and middleware
├── domain/            # Business logic modules
│   ├── auth/          # Authentication module
│   ├── tasks/         # Task management module
│   └── users/         # User management module
└── migrations/        # Database migration files
```

## Technologies Used

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [PostgreSQL](https://www.postgresql.org/) - Relational database
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [JWT](https://jwt.io/) - Token-based authentication
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [Jest](https://jestjs.io/) - Testing framework

## License

This project is proprietary and not licensed for public use.
