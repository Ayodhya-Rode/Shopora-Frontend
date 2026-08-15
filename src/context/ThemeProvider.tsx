import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

function getInitialTheme(): Theme {
  const stored = localStorage.getItem("theme");

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

const DARK_MESSAGES = [
  { emoji: "👻", text: "Lights off. Ghosts online." },
  { emoji: "🦇", text: "Bat mode activated." },
  { emoji: "💀", text: "Brightness has left the chat" },
  { emoji: "🌚", text: "The moon approves this decision" },
];

const LIGHT_MESSAGES = [
  { emoji: "🐣", text: "Sun switch found" },
  {
    emoji: "🔦",
    text: "Congratulations, you discovered electricity",
  },
  { emoji: "😎", text: "The sun has entered the chat" },
  {
    emoji: "🧴",
    text: "You'll want SPF for this brightness",
  },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const [celebration, setCelebration] = useState<{
    emoji: string;
    text: string;
    key: number;
  } | null>(null);

  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";

      const pool = next === "dark" ? DARK_MESSAGES : LIGHT_MESSAGES;

      const pick = pool[Math.floor(Math.random() * pool.length)];

      setCelebration({
        ...pick,
        key: Date.now(),
      });

      // Clear previous timeout
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      // Hide message after 2.4 seconds
      timeoutRef.current = window.setTimeout(() => {
        setCelebration(null);
        timeoutRef.current = null;
      }, 2400);

      return next;
    });
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}

      {celebration && (
        <div
          key={celebration.key}
          className="pointer-events-none fixed right-4 top-20 z-[9999] px-4 sm:right-6"
        >
          <div className="w-full max-w-[280px] rounded-2xl border border-border-default bg-surface-card px-6 py-4 text-center shadow-lg">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{celebration.emoji}</span>

              <span className="text-sm font-medium leading-5 text-text-primary">
                {celebration.text}
              </span>
            </div>
          </div>
        </div>
      )}
    </ThemeContext.Provider>
  );
}