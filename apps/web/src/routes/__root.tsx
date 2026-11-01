import { I18nProvider } from "@lingui/react";
import { HeadContent, Outlet, Scripts, createRootRouteWithContext } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { createI18n } from "@edunesia/i18n";
import { NotFoundPage } from "../components/not-found-page";
import "../style.css";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Edunesia — Admin Data Intelligence" },
      { name: "description", content: "A workspace for understanding and managing data." },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
});

function RootDocument() {
  const i18n = useMemo(() => createI18n(), []);
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-w-[320px] bg-white font-sans text-[#17251f] antialiased">
        <I18nProvider i18n={i18n}>
          <Outlet />
        </I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
