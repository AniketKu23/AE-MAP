import type { ClusterResponse, PipelineStatus, TrainResponse } from "../../lib/types";
import { Card } from "../ui/Card";

type ClusterSummaryProps = {
  status: PipelineStatus | null;
  training: TrainResponse | null;
  clustering: ClusterResponse | null;
};

export function ClusterSummary({ status, training, clustering }: ClusterSummaryProps) {
  const features = status?.feature_counts ?? {};
  const clusterCounts = clustering?.cluster_counts ?? status?.clusters ?? {};

  return (
    <Card title="Cohort Summary">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Samples" value={status?.samples ?? 0} tone="text-bluepastel" />
        <Metric label="Genomics" value={features.genomics ?? 0} tone="text-lavender" />
        <Metric label="Transcriptomics" value={features.transcriptomics ?? 0} tone="text-mint" />
        <Metric label="Proteomics" value={features.proteomics ?? 0} tone="text-rose" />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-surface/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Training Loss</p>
          <p className="mt-2 text-2xl font-semibold text-text">
            {training ? training.metrics.final_loss.toFixed(4) : "--"}
          </p>
        </div>
        <div className="rounded-md border border-border bg-surface/70 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Silhouette</p>
          <p className="mt-2 text-2xl font-semibold text-text">
            {clustering?.silhouette_score !== null && clustering?.silhouette_score !== undefined
              ? clustering.silhouette_score.toFixed(3)
              : "--"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Cluster Sizes</p>
        <div className="space-y-2">
          {Object.keys(clusterCounts).length > 0 ? (
            Object.entries(clusterCounts).map(([cluster, count]) => (
              <div className="flex items-center justify-between rounded-md bg-surface/70 px-3 py-2" key={cluster}>
                <span className="text-sm text-text">Cluster {cluster}</span>
                <span className="text-sm font-semibold text-mint">{count}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted">No clusters yet.</p>
          )}
        </div>
      </div>
    </Card>
  );
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-md border border-border bg-surface/70 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${tone}`}>{value.toLocaleString()}</p>
    </div>
  );
}
