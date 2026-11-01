import { useLingui } from "@lingui/react";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@edunesia/ui/components/button";

import { getStoredTheme, useAppThemeStore } from "../stores/app-theme.store";

export function ThemeSwitch() {
  const { i18n } = useLingui();
  const theme = useAppThemeStore((state) => state.theme);
  const setTheme = useAppThemeStore((state) => state.setTheme);
  const toggleTheme = useAppThemeStore((state) => state.toggleTheme);
  const label = i18n._(theme === "light" ? "landing.switchToDark" : "landing.switchToLight");

  useEffect(() => {
    setTheme(getStoredTheme());
  }, [setTheme]);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-11 rounded-full bg-background"
      aria-label={label}
      title={label}
      onClick={toggleTheme}
    >
      {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
    </Button>
  );
}
