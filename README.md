# Edunesia

<p align="center">
  <strong>Open Knowledge. Unlimited Possibilities.</strong>
</p>

<p align="center">
  A community-driven, open-source education platform where everyone can learn, teach, and share knowledge without boundaries.
</p>

<p align="center">
  <a href="#about">About</a> ·
  <a href="#features">Features</a> ·
  <a href="#technology-stack">Tech Stack</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#architecture">Architecture</a> ·
  <a href="#contributing">Contributing</a>
</p>

---

## About

**Edunesia** is an open-source education platform built to make knowledge accessible to everyone, everywhere.

We believe education should not be limited by financial circumstances, geographical boundaries, or access to traditional institutions.

Edunesia brings learners, educators, and contributors together in one open ecosystem where knowledge can be created, shared, explored, and continuously improved.

### Our Mission

Make quality education accessible to everyone, regardless of who they are or where they come from.

### Our Principles

| Principle        | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| Free Education   | Learning should be accessible without mandatory subscriptions. |
| Open Source      | An open platform built and improved by the community.          |
| Community Driven | Everyone can contribute knowledge and learning resources.      |
| Accessible       | Designed for different devices, languages, and abilities.      |
| Quality First    | Learning materials should be trustworthy and maintainable.     |
| Global Learning  | Knowledge should have no geographical boundaries.              |

## Features

Edunesia is designed around an interconnected learning ecosystem.

### Learn Without Limits

Discover educational resources across multiple disciplines, explore structured learning materials, and develop new skills at your own pace.

### Community-Driven Knowledge

Create, share, and improve learning resources together. Every contributor has the opportunity to help expand the global knowledge ecosystem.

### Structured Learning

Organize educational content into courses, chapters, lessons, and learning paths.

### Open Ecosystem

Built with open-source principles, extensible architecture, and shared development standards.

> The platform is actively evolving. Features are introduced incrementally as the project develops.

## Technology Stack

Edunesia uses a modern TypeScript ecosystem designed for maintainability, performance, and developer experience.

| Layer                     | Technology     |
| ------------------------- | -------------- |
| Runtime & Package Manager | Bun            |
| Monorepo Tooling          | Vite+          |
| Framework                 | TanStack Start |
| UI Framework              | React          |
| Styling                   | Tailwind CSS   |
| Component System          | shadcn/ui      |
| Authentication            | Better Auth    |
| Database                  | PostgreSQL     |
| ORM                       | Drizzle ORM    |
| API                       | tRPC           |
| Server State              | TanStack Query |
| Client State              | Zustand        |
| Forms                     | TanStack Form  |
| Validation                | Zod            |
| Internationalization      | Lingui         |
| Testing                   | Vitest         |
| E2E Testing               | Playwright     |
| Load Testing              | k6             |
| Component Development     | Storybook      |

## Architecture

Edunesia follows a modular monorepo architecture.

```text
edunesia/
├── apps/
│   └── web/                 # Main web application
│
├── packages/
│   ├── auth/                # Authentication
│   ├── config/              # Shared configuration
│   ├── database/            # PostgreSQL & Drizzle
│   ├── env/                 # Environment validation
│   ├── i18n/                # Internationalization
│   ├── logger/              # Shared logging
│   ├── query/               # TanStack Query integration
│   ├── trpc/                # Typed API integration
│   └── ui/                  # Shared UI components
│
├── content/                 # Educational content
├── docs/                    # Project documentation
├── tooling/                 # Development scripts
│
├── docker-compose.yml
├── package.json
├── bun.lock
└── README.md
```

### Workspace Responsibilities

| Package              | Responsibility                                                  |
| -------------------- | --------------------------------------------------------------- |
| `apps/web`           | TanStack Start routes, features, API handlers, and providers    |
| `@edunesia/auth`     | Better Auth server/client setup and auth schemas                |
| `@edunesia/database` | PostgreSQL connection, Drizzle schemas, helpers, and migrations |
| `@edunesia/env`      | Zod-validated client and server environment                     |
| `@edunesia/i18n`     | Lingui locale catalogs and locale utilities                     |
| `@edunesia/query`    | TanStack Query integration                                      |
| `@edunesia/trpc`     | Typed API integration                                           |
| `@edunesia/ui`       | Shared shadcn-style components, styles, and utilities           |
| `@edunesia/logger`   | Shared logging setup                                            |
| `@edunesia/config`   | Shared TypeScript base configuration                            |

## Getting Started

Get Edunesia running locally in a few steps.

### Prerequisites

Make sure you have installed:

- [Bun 1.4.4](https://bun.sh/)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd edunesia
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

The example environment file contains development placeholders only.

Configure OAuth client credentials if you want to enable either optional authentication provider.

Never commit your actual `.env` file or production credentials.

### 4. Start PostgreSQL

```bash
docker compose up -d postgres
```

The default local development database is:

```text
postgres://postgres:postgres@localhost:5432/edunesia
```

### 5. Run Database Migrations

```bash
vp run @edunesia/database#db:migrate
```

### 6. Start Development

```bash
vp run dev
```

Your local Edunesia development environment is now running.

## Development Commands

Edunesia uses Vite+ task orchestration and Bun for package management.

### Quality Checks

```bash
# Run project checks
vp check

# Run all workspace tests
vp run -r test
```

### Build

```bash
# Build the web application
vp run web#build
```

### Testing

```bash
# Run Playwright E2E tests
vp run web#test:e2e

# Run Storybook
vp run web#storybook

# Build Storybook
vp run web#storybook:build
```

### Database Management

```bash
# Generate migration from schema changes
vp run @edunesia/database#db:generate

# Apply database migrations
vp run @edunesia/database#db:migrate

# Open Drizzle Studio
vp run @edunesia/database#db:studio
```

**Important:** `db:generate` creates a new migration based on your Drizzle schema changes. Always review the generated SQL before applying it with `db:migrate`.

Database migrations are not executed automatically during application startup.

### Performance Testing

Install [k6](https://grafana.com/docs/k6/latest/set-up/install-k6/) separately.

```bash
k6 run tooling/k6/trpc-health.js
```

### Stop Local Services

```bash
docker compose down
```

## Engineering Standards

We value consistency, maintainability, and code quality.

Our development workflow uses:

- **Oxlint** for code linting.
- **Oxfmt** for consistent formatting.
- **TypeScript strict mode** for type safety.
- **Vitest** for unit and integration testing.
- **Playwright** for browser-based E2E testing.
- **Storybook** for component development and documentation.
- **k6** for performance and load testing.

### State Management

Edunesia separates client state from server state.

| State Type           | Solution        |
| -------------------- | --------------- |
| Server state         | TanStack Query  |
| UI state             | Zustand         |
| Authentication state | Better Auth     |
| Form state           | TanStack Form   |
| URL state            | TanStack Router |

The current theme preference is managed through the Zustand UI store.

### Testing Strategy

Different testing tools serve different purposes:

- Vitest: Unit and integration testing.
- Playwright: End-to-end browser testing.
- Storybook: Component development and interaction testing.
- k6: API performance and load testing.

These tools complement one another and are not interchangeable.

## Content Architecture

Edunesia uses a hybrid content approach.

- MDX and Markdown for suitable static and editorial content.
- PostgreSQL for dynamic community-generated content and application data.

This allows the platform to combine flexible content authoring with database-backed publishing and learning experiences.

## Contributing

Edunesia is built for the community.

We welcome developers, educators, writers, designers, and anyone interested in making education more accessible.

Before contributing:

1. Read the project documentation.
2. Follow the established coding standards.
3. Keep changes focused and well-tested.
4. Write clear commit messages.
5. Submit pull requests with a meaningful description.

Every contribution helps make knowledge more accessible.

## Open Source & Licensing

Edunesia is intended to be an open-source education ecosystem.

The application code and educational content may have separate licensing terms.

Please refer to the repository's license files and content attribution policies for the applicable terms.

## Vision

We believe knowledge should be shared, not restricted.

Education should be a universal opportunity, not a privilege.

Together, we can build an open ecosystem where anyone can learn, teach, create, and contribute.

<p align="center">
  <strong>Edunesia — Open Knowledge. Unlimited Possibilities.</strong>
</p>

<p align="center">
  Built with care by the open-source community.
</p>
