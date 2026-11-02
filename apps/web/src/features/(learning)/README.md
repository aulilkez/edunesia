# Learning feature

This feature owns the public course catalog, course and lesson presentation, and the current learner preview routes. Route files under `src/routes` keep URL metadata, loaders, and authentication guards; domain UI and catalog helpers live here.

The course catalog and published lesson map are in `services/course-catalog.ts`. MDX loading for TanStack Start is in `services/official-content.ts`. Learner dashboard values remain explicitly labeled sample data until connected to persisted learner records. Authentication and authorization remain owned by the auth and server packages.

Lingui catalogs and validation schemas are shared from their existing workspace packages; this feature does not define a second translation or schema system.
