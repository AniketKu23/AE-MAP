"use client";

import { StepBadge } from "../ui/StepBadge";

export type WorkflowStepId = "upload" | "fusion" | "map";

type WorkflowStepperProps = {
  activeStep: WorkflowStepId;
  completed: Record<WorkflowStepId, boolean>;
  onStepChange: (step: WorkflowStepId) => void;
};

const steps: Array<{
  id: WorkflowStepId;
  title: string;
  description: string;
}> = [
  {
    id: "upload",
    title: "Upload & Inspect",
    description: "Bring your omics sources together."
  },
  {
    id: "fusion",
    title: "Run AI Fusion",
    description: "Compress the signals into one patient signature."
  },
  {
    id: "map",
    title: "Explore the Map",
    description: "Review patient groups and pathways."
  }
];

export function WorkflowStepper({ activeStep, completed, onStepChange }: WorkflowStepperProps) {
  return (
    <nav aria-label="AE-MAP workflow" className="rounded-lg border border-borderSubtle bg-panel p-3 shadow-pastel">
      <ol className="grid gap-3 lg:grid-cols-3">
        {steps.map((step, index) => {
          const active = step.id === activeStep;
          return (
            <li key={step.id}>
              <button
                className={`flex h-full w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                  active
                    ? "border-lavender/70 bg-lavender/10"
                    : "border-borderSubtle bg-background/30 hover:border-dustyBlue/50"
                }`}
                onClick={() => onStepChange(step.id)}
                type="button"
              >
                <StepBadge active={active} complete={completed[step.id]} number={index + 1} />
                <span>
                  <span className="block text-sm font-semibold text-textPrimary">{step.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-textMuted">{step.description}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
