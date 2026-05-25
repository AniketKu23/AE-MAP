"use client";

import { MousePointerClick } from "lucide-react";

import { MetricCard } from "../ui/MetricCard";
import { ExpertMetadataPanel } from "../visualization/ExpertMetadataPanel";
import { ClusterPathwayPanel } from "../visualization/ClusterPathwayPanel";
import { LatentSpacePlot } from "../visualization/LatentSpacePlot";
import { metricTooltips, terminology } from "../../lib/terminology";
import type { ClusterResponse, VisualizationResponse } from "../../lib/types";

type ExploreMapStepProps = {
  clustering: ClusterResponse | null;
  visualization: VisualizationResponse | null;
  selectedCluster: number | null;
  onClusterSelect: (cluster: number) => void;
  onCloseCluster: () => void;
};

export function ExploreMapStep({
  clustering,
  visualization,
  selectedCluster,
  onClusterSelect,
  onCloseCluster
}: ExploreMapStepProps) {
  const points = visualization?.points ?? [];
  const pathways = clustering?.pathways ?? visualization?.pathways ?? [];

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-borderSubtle bg-panel p-5 shadow-pastel">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-dustyBlue">{terminology.patientGroupingMap.friendly}</p>
            <h2 className="mt-2 text-2xl font-semibold text-textPrimary">Explore the Map</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-textMuted">
              Each dot is one patient sample. Nearby dots have similar fused multi-omics signatures.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-md border border-borderSubtle bg-background/45 px-3 py-2 text-sm text-textMuted">
            <MousePointerClick className="h-4 w-4 text-lavender" />
            Click a group to inspect pathways.
          </div>
        </div>

        <div className="mt-5">
          <LatentSpacePlot
            onClusterSelect={onClusterSelect}
            selectedCluster={selectedCluster}
            visualization={visualization}
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="Mapped Samples"
          tone="dustyBlue"
          value={points.length.toLocaleString()}
        />
        <MetricCard
          label="Patient Groups"
          tone="lavender"
          value={clustering ? clustering.n_clusters : "--"}
        />
        <MetricCard
          expertValue={clustering?.silhouette_score !== null && clustering?.silhouette_score !== undefined ? `silhouette=${clustering.silhouette_score.toFixed(6)}` : "pending"}
          helper={metricTooltips.silhouette}
          label="Silhouette Score"
          tone="mint"
          value={clustering?.silhouette_score !== null && clustering?.silhouette_score !== undefined ? clustering.silhouette_score.toFixed(3) : "--"}
        />
      </div>

      <ExpertMetadataPanel title="Visualization JSON" data={{ clustering, visualization }} />

      <ClusterPathwayPanel
        cluster={selectedCluster}
        clustering={clustering}
        onClose={onCloseCluster}
        pathways={pathways}
        points={points}
      />
    </section>
  );
}
