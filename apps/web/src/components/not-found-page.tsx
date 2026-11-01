import { Link } from "@tanstack/react-router";
import { Activity, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@edunesia/ui/components/button";

export function NotFoundPage() {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-background px-5 py-16 text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,color-mix(in_oklch,var(--muted)_85%,transparent),transparent_60%)]"
      />
      <div className="w-full max-w-xl text-center">
        <Link
          to="/health"
          className="mx-auto mb-14 inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-4" aria-hidden="true" />
          </span>
          Edunesia
        </Link>
        <p
          aria-hidden="true"
          className="select-none text-[clamp(8rem,28vw,15rem)] leading-[0.78] font-semibold tracking-[-0.1em] text-foreground/[0.06]"
        >
          404
        </p>
        <p className="mb-3 mt-7 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          404 · Page not found
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Halaman ini tidak ditemukan
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          Alamat yang kamu buka mungkin sudah berubah atau tidak tersedia. Kembali ke status
          kesehatan untuk melanjutkan.
        </p>
        <Link to="/health" className={`${buttonVariants({ size: "lg" })} mt-8`}>
          <ArrowLeft aria-hidden="true" />
          Kembali ke status kesehatan
        </Link>
      </div>
    </main>
  );
}
