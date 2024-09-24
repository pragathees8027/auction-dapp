"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";
import Cookie from "js-cookie";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const theme = Cookie.get('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return <NextThemesProvider>{children}</NextThemesProvider>;
}
