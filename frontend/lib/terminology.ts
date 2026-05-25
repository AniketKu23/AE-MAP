export const terminology = {
  dataSourceHub: {
    friendly: "📥 Data Source Hub",
    technical: "Heterogeneous Data Ingestion"
  },
  smartDataCleanup: {
    friendly: "🧼 Smart Data Clean-Up",
    technical: "KNN Imputation & Normalization"
  },
  aiFusionEngine: {
    friendly: "🧬 AI Data Fusion Engine",
    technical: "Deep Multi-View Autoencoder"
  },
  patientGroupingMap: {
    friendly: "🎯 Patient Grouping Map",
    technical: "Spectral Clustering / UMAP"
  },
  pathwayInsights: {
    friendly: "🗺️ Biological Pathway Insights",
    technical: "KEGG Pathway Enrichment"
  }
} as const;

export const metricTooltips = {
  silhouette:
    "A score that estimates how cleanly the AI separated patients into groups. Higher values usually mean clearer group boundaries.",
  mseLoss:
    "Mean Squared Error measures how closely the neural network reconstructed the original omics data after compressing it.",
  latentDim:
    "The number of values used to represent each patient after the AI has fused all omics sources into one compact signature.",
  featureCounts:
    "The number of measured biological signals available in each omics data source after clean-up."
} as const;
