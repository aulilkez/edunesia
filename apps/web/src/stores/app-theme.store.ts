import { create } from "zustand";

export type Theme = "light" | "dark";

type AppThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const themeStorageKey = "edunesia-app-theme";

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function persistTheme(theme: Theme) {
  try {
    if (typeof window !== "undefined") window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
}

export const useAppThemeStore = create<AppThemeState>((set, get) => ({
  theme: "light",
  setTheme: (theme) => {
    set({ theme });
    persistTheme(theme);
    applyTheme(theme);
  },
  toggleTheme: () => {
    const theme = get().theme === "light" ? "dark" : "light";
    set({ theme });
    persistTheme(theme);
    applyTheme(theme);
  },
}));

export function getStoredTheme(): Theme {
  try {
    return typeof window !== "undefined" && window.localStorage.getItem(themeStorageKey) === "dark"
      ? "dark"
      : "light";
  } catch {
    return "light";
  }
}
