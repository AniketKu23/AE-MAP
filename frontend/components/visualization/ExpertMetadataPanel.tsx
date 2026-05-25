"use client";

import { useExpertMode } from "../context/ExpertModeContext";

type ExpertMetadataPanelProps = {
  title: string;
  data: unknown;
};

export function ExpertMetadataPanel({ title, data }: ExpertMetadataPanelProps) {
  const { expertMode } = useExpertMode();

  if (!expertMode) {
    return null;
  }

  return (
    <details className="rounded-lg border border-borderSubtle bg-background/45 p-4" open>
      <summary className="cursor-pointer text-sm font-semibold text-lavender">{title}</summary>
      <pre className="mt-3 max-h-72 overflow-auto rounded-md bg-background p-3 text-xs leading-5 text-textMuted">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}
