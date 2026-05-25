"use client";

import dynamic from "next/dynamic";
import type { Data, Layout } from "plotly.js";

import { CLUSTER_COLORS, plotlyConfig, plotlyLayout } from "../../lib/plotlyTheme";
import type { VisualizationResponse } from "../../lib/types";
import { Card } from "../ui/Card";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

type LatentSpacePlotProps = {
  visualization: VisualizationResponse | null;
};

export function LatentSpacePlot({ visualization }: LatentSpacePlotProps) {
  const points = visualization?.points ?? [];
  const colors = points.map((point) =>
    point.cluster === null || point.cluster === undefined
      ? "#A6ADC8"
      : CLUSTER_COLORS[point.cluster % CLUSTER_COLORS.length]
  );

  const data: Data[] = [
    {
      type: "scattergl",
      mode: "markers",
      x: points.map((point) => point.x),
      y: points.map((point) => point.y),
      text: points.map((point) => `${point.sample_id}<br>Cluster ${point.cluster ?? "pending"}`),
      hovertemplate: "%{text}<br>x=%{x:.3f}<br>y=%{y:.3f}<extra></extra>",
      marker: {
        color: colors,
        size: 9,
        line: {
          color: "rgba(30, 32, 42, 0.85)",
          width: 1
        },
        opacity: 0.9
      }
    }
  ];

  const layout: Partial<Layout> = {
    ...plotlyLayout,
    ...(visualization?.plotly_layout ?? {}),
    height: 480,
    showlegend: false
  } as Partial<Layout>;

  return (
    <Card className="min-h-[34rem]" title="Latent Space">
      {points.length > 0 ? (
        <Plot
          className="h-[30rem] w-full"
          config={plotlyConfig}
          data={data}
          layout={layout}
          useResizeHandler
        />
      ) : (
        <div className="flex h-[30rem] items-center justify-center rounded-md border border-dashed border-border bg-surface/60 text-sm text-muted">
          Latent coordinates will appear here.
        </div>
      )}
    </Card>
  );
}
