import { defineEvlog } from "evlog";

export default defineEvlog({
  service: "edunesia-web",
  environment: process.env.NODE_ENV ?? "development",
  minLevel: "info",
  pretty: process.env.NODE_ENV !== "production",
  redact: {
    paths: [
      "**.password",
      "**.passwd",
      "**.token",
      "**.secret",
      "**.cookie",
      "**.cookies",
      "**.authorization",
      "**.apiKey",
      "**.accessToken",
      "**.refreshToken",
    ],
  },
  include: ["/api/**"],
  routes: {
    "/api/auth/**": { service: "edunesia-auth" },
    "/api/trpc/**": { service: "edunesia-trpc" },
  },
});
