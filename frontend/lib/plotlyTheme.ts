import type { Config, Layout } from "plotly.js";

export const CLUSTER_COLORS = [
  "#CBA6F7",
  "#A6E3A1",
  "#F5C2E7",
  "#89B4FA",
  "#B4BEFE",
  "#94E2D5",
  "#F9E2AF",
  "#FAB387"
];

export const plotlyConfig: Partial<Config> = {
  responsive: true,
  displaylogo: false,
  modeBarButtonsToRemove: ["select2d", "lasso2d", "autoScale2d"]
};

export const plotlyLayout: Partial<Layout> = {
  autosize: true,
  paper_bgcolor: "rgba(0,0,0,0)",
  plot_bgcolor: "rgba(0,0,0,0)",
  font: {
    color: "#CDD6F4",
    family: "Inter, sans-serif"
  },
  xaxis: {
    gridcolor: "rgba(205, 214, 244, 0.12)",
    zerolinecolor: "rgba(203, 166, 247, 0.22)"
  },
  yaxis: {
    gridcolor: "rgba(205, 214, 244, 0.12)",
    zerolinecolor: "rgba(203, 166, 247, 0.22)"
  },
  margin: {
    l: 38,
    r: 20,
    t: 16,
    b: 36
  }
};
