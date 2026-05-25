export type FeatureCounts = {
  genomics?: number;
  transcriptomics?: number;
  proteomics?: number;
};

export type PipelineStatus = {
  preprocessed: boolean;
  trained: boolean;
  clustered: boolean;
  samples: number;
  feature_counts: FeatureCounts;
  clusters: Record<string, number>;
};

export type PreprocessResponse = {
  status: string;
  samples: number;
  feature_counts: FeatureCounts;
  sample_ids: string[];
};

export type TrainResponse = {
  status: string;
  latent_dim: number;
  metrics: {
    epoch_loss: number[];
    final_loss: number;
  };
};

export type ClusterResponse = {
  status: string;
  method: string;
  n_clusters: number;
  silhouette_score: number | null;
  cluster_counts: Record<string, number>;
  pathways: PathwayResult[];
};

export type VisualizationPoint = {
  sample_id: string;
  x: number;
  y: number;
  z?: number | null;
  cluster?: number | null;
};

export type PathwayResult = {
  cluster: number;
  term: string;
  adjusted_p_value?: number | null;
  overlap?: string | null;
  genes: string[];
};

export type VisualizationResponse = {
  points: VisualizationPoint[];
  pathways: PathwayResult[];
  plotly_layout: Record<string, unknown>;
};
