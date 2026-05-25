"use client";

import { Activity, BrainCircuit, Database, GitBranch, RefreshCw } from "lucide-react";
import { useState } from "react";

import type { PipelineStatus } from "../../lib/types";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";

type PipelineControlsProps = {
  status: PipelineStatus | null;
  busy: boolean;
  onPreprocess: () => Promise<void>;
  onTrain: (epochs: number, latentDim: number) => Promise<void>;
  onCluster: (method: "kmeans" | "spectral", clusters: number) => Promise<void>;
  onRefresh: () => Promise<void>;
};

export function PipelineControls({
  status,
  busy,
  onPreprocess,
  onTrain,
  onCluster,
  onRefresh
}: PipelineControlsProps) {
  const [epochs, setEpochs] = useState(20);
  const [latentDim, setLatentDim] = useState(128);
  const [clusters, setClusters] = useState(4);
  const [method, setMethod] = useState<"kmeans" | "spectral">("kmeans");

  return (
    <Card title="Pipeline">
      <div className="mb-5 flex flex-wrap gap-2">
        <StatusBadge active={Boolean(status?.preprocessed)} label="Preprocessed" />
        <StatusBadge active={Boolean(status?.trained)} label="Trained" />
        <StatusBadge active={Boolean(status?.clustered)} label="Clustered" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">Epochs</span>
          <input
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none ring-lavender/30 focus:ring-2"
            min={1}
            max={250}
            type="number"
            value={epochs}
            onChange={(event) => setEpochs(Number(event.target.value))}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">Latent Dim</span>
          <input
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none ring-lavender/30 focus:ring-2"
            min={8}
            max={512}
            type="number"
            value={latentDim}
            onChange={(event) => setLatentDim(Number(event.target.value))}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted">Clusters</span>
          <input
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-text outline-none ring-lavender/30 focus:ring-2"
            min={2}
            max={20}
            type="number"
            value={clusters}
            onChange={(event) => setClusters(Number(event.target.value))}
          />
        </label>
      </div>

      <div className="mt-4 inline-flex rounded-md border border-border bg-surface p-1">
        {(["kmeans", "spectral"] as const).map((option) => (
          <button
            className={`rounded px-3 py-1.5 text-sm transition ${
              method === option ? "bg-bluepastel/20 text-bluepastel" : "text-muted hover:text-text"
            }`}
            key={option}
            onClick={() => setMethod(option)}
            type="button"
          >
            {option === "kmeans" ? "KMeans" : "Spectral"}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button disabled={busy} icon={<Database size={16} />} onClick={onPreprocess} tone="blue">
          Preprocess
        </Button>
        <Button
          disabled={busy || !status?.preprocessed}
          icon={<BrainCircuit size={16} />}
          onClick={() => onTrain(epochs, latentDim)}
          tone="lavender"
        >
          Train
        </Button>
        <Button
          disabled={busy || !status?.trained}
          icon={<GitBranch size={16} />}
          onClick={() => onCluster(method, clusters)}
          tone="mint"
        >
          Cluster
        </Button>
        <Button disabled={busy} icon={<RefreshCw size={16} />} onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted">
        <Activity size={16} className="text-rose" />
        <span>{busy ? "Running pipeline task" : "Ready"}</span>
      </div>
    </Card>
  );
}
