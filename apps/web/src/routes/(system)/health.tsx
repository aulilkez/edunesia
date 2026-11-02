import { useLingui } from "@lingui/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Activity, Database, Languages, RefreshCw } from "lucide-react";

import { getDatabase } from "@edunesia/database";
import { serverEnv } from "@edunesia/env/server";
import { catalogs } from "@edunesia/i18n";
import { Button } from "@edunesia/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@edunesia/ui/components/card";

import { LanguageSelect } from "../../components/shared/language-select";

const getHealth = createServerFn({ method: "GET" }).handler(async () => {
  const startedAt = performance.now();
  const database = getDatabase({
    url: serverEnv.DATABASE_URL,
    environment: serverEnv.APP_ENV,
  });
  let databaseStatus: "ok" | "error" = "ok";

  try {
    await database.client`select 1 as ready`;
  } catch {
    databaseStatus = "error";
  }

  const i18nStatus = Object.keys(catalogs).length > 0 ? "ok" : "error";
  return {
    status: databaseStatus === "ok" && i18nStatus === "ok" ? ("ok" as const) : ("error" as const),
    database: { status: databaseStatus },
    i18n: { status: i18nStatus },
    durationMs: Math.round(performance.now() - startedAt),
    checkedAt: new Date().toISOString(),
  };
});

export const Route = createFileRoute("/(system)/health")({
  loader: () => getHealth(),
  component: HealthPage,
});

function HealthPage() {
  const { i18n } = useLingui();
  const router = useRouter();
  const result = Route.useLoaderData();
  const services = [
    {
      name: i18n._("health.postgres"),
      description: i18n._("health.databaseDescription"),
      status: result.database.status,
      icon: Database,
    },
    {
      name: i18n._("health.lingui"),
      description: i18n._("health.catalogDescription"),
      status: result.i18n.status,
      icon: Languages,
    },
    {
      name: "Web app",
      description: "TanStack Start server route",
      status: "ok",
      icon: Activity,
    },
  ];
  const operational = services.filter((service) => service.status === "ok").length;

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-8 px-5 py-10 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/health"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Edunesia
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {i18n._("health.pageTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{i18n._("health.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <LanguageSelect label={i18n._("health.language")} triggerClassName="w-44" />
          <Button variant="outline" onClick={() => void router.invalidate()}>
            <RefreshCw aria-hidden="true" />
            {i18n._("health.refresh")}
          </Button>
        </div>
      </header>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>
              {result.status === "error"
                ? i18n._("health.attention")
                : i18n._("health.serviceStatus")}
            </CardTitle>
            <span
              className={`inline-flex items-center gap-2 text-sm font-medium ${
                result.status === "ok" ? "text-emerald-600" : "text-destructive"
              }`}
              role="status"
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${
                  result.status === "ok" ? "bg-emerald-600" : "bg-destructive"
                }`}
              />
              {result.status === "ok" ? i18n._("health.connected") : i18n._("health.disconnected")}
            </span>
          </div>
          <CardDescription>
            {`${i18n._("health.servicesOperational")}: ${operational}/${services.length}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {services.map(({ name, description, status, icon: Icon }) => (
            <div key={name} className="flex items-start gap-3 rounded-lg border p-4">
              <Icon
                className={`mt-0.5 size-4 ${
                  status === "ok" ? "text-emerald-600" : "text-destructive"
                }`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-medium">{name}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p
                  className={`mt-2 text-xs font-medium ${
                    status === "ok" ? "text-emerald-600" : "text-destructive"
                  }`}
                  role="status"
                >
                  {status === "ok" ? i18n._("health.operational") : i18n._("health.unavailable")}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        {i18n._("health.lastChecked")}: {new Date(result.checkedAt).toLocaleString(i18n.locale)}
      </p>
    </main>
  );
}
