"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon } from "./sun";
import { SparklesIcon } from "./sparkles";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center"
    >
      <div className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">
        <SunIcon />
      </div>
      <div className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">
        <SparklesIcon />
      </div>
      <span className="sr-only">Toggle theme</span>
    </div>
  );
}
