import { Check } from "lucide-react";

type StepBadgeProps = {
  number: number;
  active: boolean;
  complete: boolean;
};

export function StepBadge({ number, active, complete }: StepBadgeProps) {
  if (complete) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-mint bg-mint/15 text-mint">
        <Check className="h-4 w-4" />
      </span>
    );
  }

  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
        active
          ? "border-lavender bg-lavender/15 text-lavender"
          : "border-borderSubtle bg-background/60 text-textMuted"
      }`}
    >
      {number}
    </span>
  );
}
