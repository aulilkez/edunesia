# @edunesia/database

Drizzle/PostgreSQL schema and connection factory for Edunesia identities, workspaces, and dataset
metadata. It includes pagination, soft-delete, and retryable transaction helpers. This package does
not store uploaded dataset contents. Use migrations for schema changes.

```sh
docker compose up -d postgres
vp run @edunesia/database#db:generate
vp run @edunesia/database#db:migrate
```
