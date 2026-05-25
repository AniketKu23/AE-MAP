"use client";

import { BrainCircuit, CheckCircle2, Loader2 } from "lucide-react";

import { useExpertMode } from "../context/ExpertModeContext";
import { MetricCard } from "../ui/MetricCard";
import { Tooltip } from "../ui/Tooltip";
import { ExpertMetadataPanel } from "../visualization/ExpertMetadataPanel";
import { metricTooltips, terminology } from "../../lib/terminology";
import type { ClusterResponse, PipelineStatus, TrainResponse } from "../../lib/types";

type RunAIFusionStepProps = {
  busy: boolean;
  status: PipelineStatus | null;
  training: TrainResponse | null;
  clustering: ClusterResponse | null;
  onRunFusion: () => Promise<void>;
};

export function RunAIFusionStep({
  busy,
  status,
  training,
  clustering,
  onRunFusion
}: RunAIFusionStepProps) {
  const { expertMode } = useExpertMode();
  const canRun = Boolean(status?.preprocessed) && !busy;
  const finalLoss = training?.metrics.final_loss;
  const silhouette = clustering?.silhouette_score;

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
      <div className="rounded-lg border border-borderSubtle bg-panel p-5 shadow-pastel">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-semibold text-lavender">{terminology.aiFusionEngine.friendly}</p>
            <h2 className="mt-2 text-2xl font-semibold text-textPrimary">Run AI Fusion</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-textMuted">
              The neural network learns a compact patient signature by reconstructing all three omics views from a shared latent space.
            </p>
          </div>
          <button
            className="inline-flex items-center justify-center gap-2 rounded-md border border-lavender/60 bg-lavender/15 px-4 py-2 text-sm font-medium text-lavender transition hover:bg-lavender/25 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canRun}
            onClick={() => void onRunFusion()}
            type="button"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
            {busy ? "Fusing data..." : "Run AI fusion"}
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-borderSubtle bg-background/45 p-5">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-textPrimary">Neural network progress</h3>
            <Tooltip content="This step compresses many biological measurements into one patient-level signal that can be grouped and plotted." />
          </div>
          <div className="mt-5 grid gap-3">
            <ProgressRow active={busy} complete={Boolean(status?.preprocessed)} label="Clean data loaded" />
            <ProgressRow active={busy} complete={Boolean(training)} label="Omics views fused into latent signatures" />
            <ProgressRow active={busy} complete={Boolean(clustering)} label="Patient groups prepared for mapping" />
          </div>
        </div>

        {busy ? (
          <div className="mt-5 overflow-hidden rounded-lg border border-lavender/30 bg-lavender/10">
            <div className="h-1.5 w-1/2 animate-pulse rounded-r-full bg-lavender" />
            <p className="p-4 text-sm leading-6 text-textPrimary">
              AE-MAP is learning shared patterns across omics layers. In expert mode, reconstruction loss and latent dimensions appear here after training.
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-borderSubtle bg-panel p-5 shadow-pastel">
          <h3 className="text-xl font-semibold text-textPrimary">Fusion results</h3>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            Default mode keeps this high-level. Expert mode reveals the model’s raw metrics.
          </p>
          <div className="mt-5 grid gap-3">
            <MetricCard
              expertValue={finalLoss !== undefined ? `final_mse=${finalLoss.toFixed(6)}` : "pending"}
              helper={metricTooltips.mseLoss}
              label={expertMode ? "MSE Loss" : "Reconstruction Quality"}
              tone="lavender"
              value={finalLoss !== undefined ? (finalLoss < 0.9 ? "Stable" : "Learning") : "Pending"}
            />
            <MetricCard
              expertValue={training ? `latent_dim=${training.latent_dim}` : "pending"}
              helper={metricTooltips.latentDim}
              label={expertMode ? "Latent Vector Dimensions" : "Patient Signature Size"}
              tone="dustyBlue"
              value={training ? `${training.latent_dim}` : "--"}
            />
            <MetricCard
              expertValue={silhouette !== null && silhouette !== undefined ? `silhouette=${silhouette.toFixed(6)}` : "pending"}
              helper={metricTooltips.silhouette}
              label="Silhouette Score"
              tone="mint"
              value={silhouette !== null && silhouette !== undefined ? silhouette.toFixed(3) : "--"}
            />
          </div>
        </div>

        <ExpertMetadataPanel title="Training and clustering JSON" data={{ training, clustering, status }} />
      </div>
    </section>
  );
}

function ProgressRow({ active, complete, label }: { active: boolean; complete: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-borderSubtle bg-panel/70 px-3 py-3">
      {complete ? (
        <CheckCircle2 className="h-5 w-5 text-mint" />
      ) : active ? (
        <Loader2 className="h-5 w-5 animate-spin text-lavender" />
      ) : (
        <span className="h-5 w-5 rounded-full border border-borderSubtle" />
      )}
      <span className="text-sm text-textPrimary">{label}</span>
    </div>
  );
}
