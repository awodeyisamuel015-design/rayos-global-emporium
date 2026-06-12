"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-4 py-2 rounded-full bg-gray-300">
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        );
      }}
      className="
        px-4 py-2 rounded-full font-semibold
        bg-gray-200 text-black
        dark:bg-gray-800 dark:text-white
        transition
      "
    >
      {theme === "dark"
        ? "☀️ Light"
        : "🌙 Dark"}
    </button>
  );
}