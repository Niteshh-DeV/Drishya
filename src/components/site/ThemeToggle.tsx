"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "drishya-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.dataset.theme === "dark");
  }, []);

  /**
   * The new theme spreads out in a circle from the button (a view
   * transition on the whole page; `[data-theme-switch]` in globals.css).
   * Browsers without view transitions, and reduced motion, swap at once.
   */
  function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
    const nextDark = !dark;
    const root = document.documentElement;
    const apply = () => {
      root.dataset.theme = nextDark ? "dark" : "light";
      flushSync(() => setDark(nextDark));
    };
    try {
      localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light");
    } catch {
      // Keep the in-page toggle working when browser storage is unavailable.
    }

    if (!document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply();
      return;
    }
    const box = event.currentTarget.getBoundingClientRect();
    root.style.setProperty("--theme-x", `${box.left + box.width / 2}px`);
    root.style.setProperty("--theme-y", `${box.top + box.height / 2}px`);
    root.dataset.themeSwitch = "";
    document.startViewTransition(apply).finished.finally(() => {
      delete root.dataset.themeSwitch;
    });
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="dock-item grid h-9 w-9 shrink-0 place-items-center rounded-full text-stone outline-none hover:bg-slate/70 hover:text-dock-text focus-visible:bg-slate/70 focus-visible:text-dock-text focus-visible:ring-1 focus-visible:ring-brass/60"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px]"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {dark ? (
          <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
        ) : (
          <>
            <circle cx="12" cy="12" r="3.5" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        )}
      </svg>
    </button>
  );
}
