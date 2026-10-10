"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

// The app ships a single dark theme; Magic UI's MagicCard reads it via next-themes.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" forcedTheme="dark" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
