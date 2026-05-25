"use client";

import type { ReactNode } from "react";

import { useExpertMode } from "../context/ExpertModeContext";
import { Tooltip } from "./Tooltip";

type MetricCardProps = {
  label: string;
  value: ReactNode;
  helper?: ReactNode;
  expertValue?: ReactNode;
  tone?: "lavender" | "mint" | "rose" | "dustyBlue";
};

const tones = {
  lavender: "text-lavender",
  mint: "text-mint",
  rose: "text-rose",
  dustyBlue: "text-dustyBlue"
};

export function MetricCard({
  label,
  value,
  helper,
  expertValue,
  tone = "dustyBlue"
}: MetricCardProps) {
  const { expertMode } = useExpertMode();

  return (
    <div className="rounded-lg border border-borderSubtle bg-background/45 p-4">
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-textMuted">{label}</p>
        {helper ? <Tooltip content={helper} /> : null}
      </div>
      <div className={`mt-2 text-2xl font-semibold ${tones[tone]}`}>{value}</div>
      {expertMode && expertValue ? (
        <div className="mt-3 rounded-md border border-borderSubtle bg-panel/70 p-2 font-mono text-xs text-textMuted">
          {expertValue}
        </div>
      ) : null}
    </div>
  );
}
