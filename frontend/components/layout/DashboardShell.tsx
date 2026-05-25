import type { ReactNode } from "react";

import { ExpertModeToggle } from "./ExpertModeToggle";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-4 py-5 text-textPrimary sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-borderSubtle pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-dustyBlue">AE-MAP</p>
            <h1 className="mt-2 max-w-4xl text-3xl font-semibold text-textPrimary md:text-4xl">
              AutoEncoder Multi-omics Analytics Pipeline
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-textMuted">
              A guided dashboard for turning genomics, transcriptomics, and proteomics into patient groups and pathway insights.
            </p>
          </div>
          <ExpertModeToggle />
        </header>
        {children}
      </div>
    </main>
  );
}
