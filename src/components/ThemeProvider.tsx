"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function ThemeProvider() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const el = document.documentElement;
    el.classList.remove("theme-default", "theme-green", "theme-purple");
    el.classList.add(`theme-${theme}`);
  }, [theme]);

  return null;
}
