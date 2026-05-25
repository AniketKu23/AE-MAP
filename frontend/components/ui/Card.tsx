import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  action?: ReactNode;
};

export function Card({ title, action, className, children, ...props }: CardProps) {
  return (
    <section
      className={clsx(
        "rounded-lg border border-border/70 bg-elevated/90 p-5 shadow-pastel backdrop-blur",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{title}</h2> : null}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
