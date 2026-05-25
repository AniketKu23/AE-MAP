import type {
  ClusterResponse,
  PipelineStatus,
  PreprocessResponse,
  TrainResponse,
  VisualizationResponse
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.detail ?? `Request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export function getStatus() {
  return apiRequest<PipelineStatus>("/status");
}

export function preprocessDemo() {
  return apiRequest<PreprocessResponse>("/preprocessing", {
    method: "POST",
    body: JSON.stringify({ use_demo_data: true, knn_neighbors: 5 })
  });
}

export function trainAutoencoder(options: { epochs: number; latent_dim: number }) {
  return apiRequest<TrainResponse>("/training", {
    method: "POST",
    body: JSON.stringify({
      epochs: options.epochs,
      batch_size: 32,
      learning_rate: 0.001,
      latent_dim: options.latent_dim,
      hidden_dim: 256
    })
  });
}

export function clusterLatent(options: { method: "kmeans" | "spectral"; n_clusters: number }) {
  return apiRequest<ClusterResponse>("/analytics/cluster", {
    method: "POST",
    body: JSON.stringify(options)
  });
}

export function getVisualization() {
  return apiRequest<VisualizationResponse>("/visualization");
}
