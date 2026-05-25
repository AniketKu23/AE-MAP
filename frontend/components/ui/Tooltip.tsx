import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

type TooltipProps = {
  content: ReactNode;
  label?: string;
};

export function Tooltip({ content, label = "More context" }: TooltipProps) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        aria-label={label}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-lavender/60 bg-lavender/10 text-lavender transition hover:bg-lavender/20 focus:outline-none focus:ring-2 focus:ring-lavender/40"
        type="button"
      >
        <HelpCircle className="h-3.5 w-3.5" />
      </button>
      <span className="pointer-events-none absolute right-0 top-7 z-30 hidden w-64 rounded-md border border-lavender/30 bg-panel p-3 text-left text-xs leading-5 text-textPrimary shadow-lavender group-hover:block group-focus-within:block">
        {content}
      </span>
    </span>
  );
}
