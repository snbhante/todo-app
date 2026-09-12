"use client";

import { useEffect, useSyncExternalStore } from "react";
import { themeStore } from "../lib/theme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preferences = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, themeStore.getServerSnapshot);

  useEffect(() => {
    themeStore.initialize();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = preferences.theme;
    root.classList.toggle("reduced-motion", preferences.reducedMotion);
  }, [preferences]);

  return children;
}
