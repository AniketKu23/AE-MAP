import { clsx } from "clsx";

type StatusBadgeProps = {
  active: boolean;
  label: string;
};

export function StatusBadge({ active, label }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium",
        active
          ? "border-mint/50 bg-mint/10 text-mint"
          : "border-border bg-surface/80 text-muted"
      )}
    >
      <span
        className={clsx(
          "h-1.5 w-1.5 rounded-full",
          active ? "bg-mint" : "bg-muted"
        )}
      />
      {label}
    </span>
  );
}
