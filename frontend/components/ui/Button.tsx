import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  tone?: "lavender" | "mint" | "blue" | "rose" | "neutral";
};

const toneStyles = {
  lavender: "border-lavender/60 bg-lavender/15 text-lavender hover:bg-lavender/25",
  mint: "border-mint/60 bg-mint/15 text-mint hover:bg-mint/25",
  blue: "border-bluepastel/60 bg-bluepastel/15 text-bluepastel hover:bg-bluepastel/25",
  rose: "border-rose/60 bg-rose/15 text-rose hover:bg-rose/25",
  neutral: "border-border bg-surface text-text hover:bg-border/40"
};

export function Button({
  icon,
  tone = "neutral",
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-medium transition",
        "focus:outline-none focus:ring-2 focus:ring-lavender/40 disabled:cursor-not-allowed disabled:opacity-45",
        toneStyles[tone],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
