Welcome to your new TanStack Start app!

# Getting Started

To run this application:

```bash
cp .env.example .env
bun install
bun --bun run dev
```

## Environment Variables

> **Authentication status:** the root app currently has no Better Auth runtime;
> the auth/OAuth variables below are placeholders, not working sign-in flows.

Environment variables are validated with Zod through `@t3-oss/env-core`. Import
`clientEnv` from `src/lib/env/client.ts` for browser-safe `VITE_*` values and
`serverEnv` from `src/lib/env/server.ts` only in server-side code. Server secrets are never
available through `clientEnv`.

Structured logging uses `evlog`. Browser errors are logged from the root document, while
server-side code can use `createWebLogger` or `logWebsiteRequestFailure` from
`src/lib/server/logger.ts`. Secret-like fields are redacted by `evlog.config.ts`.

The local database URL in `.env.example` matches the PostgreSQL credentials in `compose.yaml`.
Start the local database and apply schema migrations with:

```bash
bun run db:up
bun run db:migrate
```

The initial Drizzle schema is in `src/db/schema.ts`. Generate future migrations with
`bun run db:generate`, and open Drizzle Studio with `bun run db:studio`. Production requires
explicit database, auth, and SMTP settings; SMTP credentials and each OAuth provider's ID/secret
must be configured as pairs.

The tRPC API is available at `/api/trpc`. Its request context and router initialization are in
`src/lib/server/trpc/`; the API route only adapts HTTP requests. Add procedures through
`src/lib/server/trpc/init.ts` and compose domain routers in `src/lib/server/trpc/routers/_app.ts`.
For client queries, use `useTRPC()` from `src/lib/trpc` with TanStack Query hooks. The home page
demonstrates a health query prefetched by its route loader. QueryClient state is isolated per router
request and dehydrated/hydrated by `@tanstack/react-router-ssr-query`.

The health procedure is public. There is no authentication integration in this starter yet, so
do not expose private data or add protected procedures until an auth provider is configured.
Run the tRPC/query checks with `bun run test`.

## Curated learning content

Git-managed courses and lessons use Content Collections with Zod frontmatter
schemas, validated relationships, and a shared SSR Markdown/MDX renderer.
Public routes are available at `/courses/` and
`/courses/{courseSlug}/{lessonSlug}`. Read [content/README.md](./content/README.md)
before adding lessons. Community content remains a separate database-backed
concern and must use the safe Markdown-only renderer, never the trusted MDX
compiler.

## Developer standards

The root `vite.config.ts` is the shared Vite+ configuration. Use
`bun run check`, `bun run test`, and `bun run build` before submitting changes.
See [CONTRIBUTING.md](./CONTRIBUTING.md) and
[docs/engineering.md](./docs/engineering.md) for tooling, CI, dependency
automation, Trivy, and Lefthook details.

# Building For Production

To build this application for production:

```bash
bun --bun run build
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

### Removing Tailwind CSS

If you prefer not to use Tailwind CSS:

1. Remove the demo pages in `src/routes/demo/`
2. Replace the Tailwind import in `src/styles/globals.css` with your own styles
3. Remove `tailwindcss()` from the plugins array in `vite.config.ts`
4. Remove `@tailwindcss/vite` and `tailwindcss` from `package.json`

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing. Routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you render `{children}` in the `shellComponent`.

Here is an example layout that includes a header:

```tsx
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "My App" },
    ],
  }),
  shellComponent: ({ children }) => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <header>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
          </nav>
        </header>
        {children}
        <Scripts />
      </body>
    </html>
  ),
});
```

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Server Functions

TanStack Start provides server functions that allow you to write server-side code that seamlessly integrates with your client components.

```tsx
import { createServerFn } from "@tanstack/react-start";

const getServerTime = createServerFn({
  method: "GET",
}).handler(async () => {
  return new Date().toISOString();
});

// Use in a component
function MyComponent() {
  const [time, setTime] = useState("");

  useEffect(() => {
    getServerTime().then(setTime);
  }, []);

  return <div>Server time: {time}</div>;
}
```

## API Routes

You can create API routes by using the `server` property in your route definitions:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";

export const Route = createFileRoute("/api/hello")({
  server: {
    handlers: {
      GET: () => json({ message: "Hello, World!" }),
    },
  },
});
```

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/people")({
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json();
  },
  component: PeopleComponent,
});

function PeopleComponent() {
  const data = Route.useLoaderData();
  return (
    <ul>
      {data.results.map((person) => (
        <li key={person.name}>{person.name}</li>
      ))}
    </ul>
  );
}
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

For TanStack Start specific documentation, visit [TanStack Start](https://tanstack.com/start).
