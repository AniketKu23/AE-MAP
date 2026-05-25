import { X } from "lucide-react";
import type { ReactNode } from "react";

type SlideOverPanelProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onClose: () => void;
};

export function SlideOverPanel({ open, title, subtitle, children, onClose }: SlideOverPanelProps) {
  return (
    <aside
      aria-hidden={!open}
      className={`fixed inset-y-0 right-0 z-40 w-full max-w-md border-l border-borderSubtle bg-panel shadow-pastel transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-borderSubtle p-5">
          <div>
            <h2 className="text-lg font-semibold text-textPrimary">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-textMuted">{subtitle}</p> : null}
          </div>
          <button
            aria-label="Close pathway details"
            className="rounded-md border border-borderSubtle p-2 text-textMuted transition hover:border-rose/50 hover:text-rose"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </aside>
  );
}
