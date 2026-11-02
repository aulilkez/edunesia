import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Menu, Search } from "lucide-react";
import { useState } from "react";

import { authClient } from "@edunesia/auth/client";
import { Button } from "@edunesia/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@edunesia/ui/components/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@edunesia/ui/components/sheet";

import { ThemeSwitch } from "../../../../components/shared/theme-switch";

export function LearnHeader({ app = false }: { app?: boolean }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-7 px-4 sm:px-7 lg:px-10">
          <Link
            to="/learn"
            aria-label="Edunesia Learn home"
            className="flex shrink-0 items-center gap-2.5 rounded-md font-semibold tracking-tight focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-[#155eef] text-white">
              <BookOpen className="size-4" />
            </span>
            <span>
              edunesia<span className="ml-1 font-normal text-muted-foreground">learn</span>
            </span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm lg:flex">
            <Link to="/learn" className="font-medium text-foreground">
              Explore
            </Link>
            <a href="/learn#subjects" className="text-muted-foreground hover:text-foreground">
              Subjects
            </a>
            <a
              href="https://github.com/aulilkez/edunesia"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Community
            </a>
          </nav>
          <label className="ml-auto hidden h-9 w-full max-w-[360px] items-center gap-2 rounded-md border bg-muted/40 px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/50 sm:flex">
            <Search className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only">Search courses</span>
            <input
              aria-label="Search courses"
              placeholder="Search courses, topics..."
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter")
                  window.location.href = `/learn?query=${encodeURIComponent(e.currentTarget.value)}`;
              }}
            />
            <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <ThemeSwitch />
            {!app && (
              <Button
                variant="ghost"
                className="hidden sm:inline-flex"
                onClick={() => setAuthOpen(true)}
              >
                Sign in
              </Button>
            )}
            <Link
              to="/learn/my-learning"
              className="hidden rounded-md bg-[#155eef] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#124fce] sm:inline-flex"
            >
              {app ? "Learner preview" : "Get started"}
            </Link>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden"
                  aria-label="Open navigation"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Edunesia Learn</SheetTitle>
                  <SheetDescription>Find a place to begin.</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-1 px-4">
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/learn"
                    className="rounded-md px-3 py-3 hover:bg-muted"
                  >
                    Explore courses
                  </Link>
                  <a
                    href="/learn#subjects"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-3 hover:bg-muted"
                  >
                    Subjects
                  </a>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    to="/learn/my-learning"
                    className="rounded-md px-3 py-3 hover:bg-muted"
                  >
                    Learner preview
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to Edunesia</DialogTitle>
            <DialogDescription>
              Authentication is not connected in this prototype. You can still read all published
              lessons, or open the clearly labeled learner preview.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              className="bg-[#155eef] hover:bg-[#124fce]"
              onClick={() => {
                setAuthOpen(false);
                window.location.href = "/learn/my-learning";
              }}
            >
              Open learner preview
            </Button>
            <Button variant="outline" onClick={() => setAuthOpen(false)}>
              Keep exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function LearnAppFrame({ children, active }: { children: React.ReactNode; active: string }) {
  const navigate = useNavigate();
  const learnerLinks = [
    { label: "My learning", href: "/learn/my-learning" },
    { label: "Bookmarks", href: "/learn/bookmarks" },
    { label: "Progress", href: "/learn/progress" },
    { label: "Explore courses", href: "/learn" },
  ] as const;
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LearnHeader app />
      <div className="mx-auto flex max-w-[1440px] justify-end border-b px-4 py-2 sm:px-7 lg:px-9">
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await authClient.signOut();
            await navigate({ to: "/" });
          }}
        >
          Sign out
        </Button>
      </div>
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[224px_minmax(0,1fr)]">
        <aside className="hidden min-h-[calc(100svh-4rem)] border-r px-4 py-6 lg:block">
          <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Learning
          </p>
          <nav className="mt-3 grid gap-1" aria-label="Learner navigation">
            {learnerLinks.map(({ label, href }) => (
              <Link
                key={href}
                to={href}
                aria-current={active === href ? "page" : undefined}
                className={`flex min-h-10 items-center gap-3 rounded-md px-3 text-sm ${active === href ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-md border bg-muted/35 p-3">
            <p className="text-xs font-semibold">Prototype workspace</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Progress below is local sample data and is not tied to an account.
            </p>
          </div>
        </aside>
        <main className="min-w-0 px-4 py-7 sm:px-7 lg:px-9 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
