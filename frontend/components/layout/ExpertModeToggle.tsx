"use client";

import { SlidersHorizontal } from "lucide-react";

import { useExpertMode } from "../context/ExpertModeContext";

export function ExpertModeToggle() {
  const { expertMode, toggleExpertMode } = useExpertMode();

  return (
    <button
      aria-pressed={expertMode}
      className="group inline-flex items-center gap-3 rounded-lg border border-borderSubtle bg-panel px-3 py-2 text-sm text-textPrimary shadow-pastel transition hover:border-lavender/60"
      onClick={toggleExpertMode}
      type="button"
    >
      <SlidersHorizontal className="h-4 w-4 text-lavender" />
      <span className="hidden font-medium sm:inline">Expert Mode</span>
      <span
        className={`relative h-6 w-11 rounded-full border transition ${
          expertMode ? "border-lavender bg-lavender/30" : "border-borderSubtle bg-background"
        }`}
      >
        <span
          className={`absolute top-1 h-3.5 w-3.5 rounded-full transition ${
            expertMode ? "left-5 bg-lavender" : "left-1 bg-textMuted"
          }`}
        />
      </span>
    </button>
  );
}
