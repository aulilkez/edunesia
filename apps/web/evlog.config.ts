import { defineEvlog } from "evlog";

export default defineEvlog({
  service: "edunesia-web",
  pretty: process.env.NODE_ENV !== "production",
  include: ["/api/**"],
  routes: {
    "/api/auth/**": { service: "edunesia-auth" },
    "/api/trpc/**": { service: "edunesia-trpc" },
  },
});
