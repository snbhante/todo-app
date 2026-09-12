"use client";

export type ThemeMode = "system" | "light" | "dark";

const THEME_KEY = "luma-theme";
const MOTION_KEY = "luma-reduced-motion";

type ThemeSnapshot = { theme: ThemeMode; reducedMotion: boolean };

const serverSnapshot: ThemeSnapshot = { theme: "system", reducedMotion: false };
let snapshot: ThemeSnapshot = { theme: "system", reducedMotion: false };
const listeners = new Set<() => void>();
let initialized = false;

const notify = () => listeners.forEach((listener) => listener());

export const themeStore = {
  initialize() {
    if (initialized || typeof window === "undefined") return;
    initialized = true;
    const savedTheme = window.localStorage.getItem(THEME_KEY);
    const savedMotion = window.localStorage.getItem(MOTION_KEY);
    snapshot = {
      theme: savedTheme === "light" || savedTheme === "dark" ? savedTheme : "system",
      reducedMotion: savedMotion === "true",
    };
    notify();
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => serverSnapshot,
  setTheme(theme: ThemeMode) {
    snapshot = { ...snapshot, theme };
    if (typeof window !== "undefined") window.localStorage.setItem(THEME_KEY, theme);
    notify();
  },
  setReducedMotion(reducedMotion: boolean) {
    snapshot = { ...snapshot, reducedMotion };
    if (typeof window !== "undefined") window.localStorage.setItem(MOTION_KEY, String(reducedMotion));
    notify();
  },
};
