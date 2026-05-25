"use client";

import { useMemo } from "react";

import { useExpertMode } from "../context/ExpertModeContext";
import { SlideOverPanel } from "../ui/SlideOverPanel";
import { Tooltip } from "../ui/Tooltip";
import { terminology } from "../../lib/terminology";
import type { ClusterResponse, PathwayResult, VisualizationPoint } from "../../lib/types";

type ClusterPathwayPanelProps = {
  cluster: number | null;
  points: VisualizationPoint[];
  pathways: PathwayResult[];
  clustering: ClusterResponse | null;
  onClose: () => void;
};

export function ClusterPathwayPanel({
  cluster,
  points,
  pathways,
  clustering,
  onClose
}: ClusterPathwayPanelProps) {
  const { expertMode } = useExpertMode();
  const clusterPoints = useMemo(
    () => points.filter((point) => point.cluster === cluster),
    [cluster, points]
  );
  const clusterPathways = useMemo(
    () => pathways.filter((pathway) => pathway.cluster === cluster),
    [cluster, pathways]
  );

  return (
    <SlideOverPanel
      onClose={onClose}
      open={cluster !== null}
      subtitle={`${clusterPoints.length} patient samples in this group`}
      title={cluster === null ? "Group details" : `Patient Group ${cluster}`}
    >
      <div className="space-y-5">
        <section className="rounded-lg border border-borderSubtle bg-background/45 p-4">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-mint">{terminology.pathwayInsights.friendly}</p>
            <Tooltip content="Pathway enrichment connects a patient group to known biological processes. It helps translate the map into biology." />
          </div>
          <p className="mt-3 text-sm leading-6 text-textMuted">
            These pathways describe biological programs that may be more active or relevant in the selected patient group.
          </p>
        </section>

        {clusterPathways.length > 0 ? (
          <div className="space-y-3">
            {clusterPathways.map((pathway, index) => (
              <article
                className="rounded-lg border border-borderSubtle bg-background/45 p-4"
                key={`${pathway.cluster}-${pathway.term}-${index}`}
              >
                <h3 className="text-sm font-semibold text-textPrimary">{pathway.term}</h3>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-md border border-mint/40 bg-mint/10 px-2 py-1 text-mint">
                    overlap {pathway.overlap ?? "--"}
                  </span>
                  <span className="rounded-md border border-lavender/40 bg-lavender/10 px-2 py-1 text-lavender">
                    adj. p {pathway.adjusted_p_value?.toExponential(2) ?? "--"}
                  </span>
                </div>
                {expertMode ? (
                  <pre className="mt-3 max-h-36 overflow-auto rounded-md bg-panel p-3 text-xs leading-5 text-textMuted">
                    {JSON.stringify(pathway, null, 2)}
                  </pre>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-borderSubtle bg-background/45 p-5 text-sm leading-6 text-textMuted">
            No enriched KEGG pathway results are available yet for this group. With real gene symbols and network access, this panel will populate with pathway hits.
          </div>
        )}

        {expertMode ? (
          <section className="rounded-lg border border-borderSubtle bg-background/45 p-4">
            <h3 className="text-sm font-semibold text-lavender">Raw cluster metadata</h3>
            <pre className="mt-3 max-h-56 overflow-auto rounded-md bg-panel p-3 text-xs leading-5 text-textMuted">
              {JSON.stringify(
                {
                  cluster,
                  sample_count: clusterPoints.length,
                  cluster_counts: clustering?.cluster_counts,
                  silhouette_score: clustering?.silhouette_score,
                  sample_ids: clusterPoints.map((point) => point.sample_id)
                },
                null,
                2
              )}
            </pre>
          </section>
        ) : null}
      </div>
    </SlideOverPanel>
  );
}
