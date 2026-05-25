"use client";

import dynamic from "next/dynamic";
import type { Data, Layout, PlotMouseEvent } from "plotly.js";

import { CLUSTER_COLORS, plotlyConfig, plotlyLayout } from "../../lib/plotlyTheme";
import type { VisualizationPoint, VisualizationResponse } from "../../lib/types";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type LatentSpacePlotProps = {
  visualization: VisualizationResponse | null;
  selectedCluster: number | null;
  onClusterSelect: (cluster: number) => void;
};

export function LatentSpacePlot({
  visualization,
  selectedCluster,
  onClusterSelect
}: LatentSpacePlotProps) {
  const points = visualization?.points ?? [];

  if (points.length === 0) {
    return (
      <div className="flex h-[31rem] items-center justify-center rounded-lg border border-dashed border-borderSubtle bg-background/45 text-sm text-textMuted">
        Run AI fusion to reveal the patient grouping map.
      </div>
    );
  }

  const traces = buildClusterTraces(points, selectedCluster);
  const layout: Partial<Layout> = {
    ...plotlyLayout,
    ...(visualization?.plotly_layout ?? {}),
    height: 500,
    showlegend: true,
    legend: {
      orientation: "h",
      x: 0,
      y: 1.08,
      font: { color: "#CDD6F4" }
    },
    hoverlabel: {
      bgcolor: "#24283B",
      bordercolor: "#CBA6F7",
      font: { color: "#CDD6F4" }
    }
  } as Partial<Layout>;

  return (
    <Plot
      className="h-[31rem] w-full"
      config={plotlyConfig}
      data={traces}
      layout={layout}
      onClick={(event: Readonly<PlotMouseEvent>) => {
        const cluster = event.points[0]?.customdata;
        if (typeof cluster === "number") {
          onClusterSelect(cluster);
        }
      }}
      useResizeHandler
    />
  );
}

function buildClusterTraces(points: VisualizationPoint[], selectedCluster: number | null): Data[] {
  const grouped = new Map<number, VisualizationPoint[]>();

  points.forEach((point) => {
    const cluster = point.cluster ?? -1;
    grouped.set(cluster, [...(grouped.get(cluster) ?? []), point]);
  });

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left - right)
    .map(([cluster, clusterPoints]) => {
      const color = cluster === -1 ? "#CDD6F4" : CLUSTER_COLORS[cluster % CLUSTER_COLORS.length];
      const dimmed = selectedCluster !== null && selectedCluster !== cluster;

      return {
        type: "scattergl",
        mode: "markers",
        name: cluster === -1 ? "Ungrouped" : `Group ${cluster}`,
        x: clusterPoints.map((point) => point.x),
        y: clusterPoints.map((point) => point.y),
        text: clusterPoints.map((point) => point.sample_id),
        customdata: clusterPoints.map(() => cluster),
        hovertemplate: "%{text}<br>Group %{customdata}<br>x=%{x:.3f}<br>y=%{y:.3f}<extra></extra>",
        marker: {
          color,
          size: selectedCluster === cluster ? 12 : 9,
          line: {
            color: selectedCluster === cluster ? "#CDD6F4" : "rgba(26, 27, 38, 0.85)",
            width: selectedCluster === cluster ? 2 : 1
          },
          opacity: dimmed ? 0.28 : 0.92
        }
      };
    });
}
