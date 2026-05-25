from collections import Counter
from collections.abc import Mapping

import numpy as np
import pandas as pd
import torch
from sklearn.cluster import KMeans, SpectralClustering
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score

from app.ml.datasets import MultiOmicsTensorDataset
from app.ml.model import MultiViewAutoencoder


PASTEL_CLUSTER_COLORS = [
    "#CBA6F7",
    "#A6E3A1",
    "#F5C2E7",
    "#89B4FA",
    "#FAB387",
    "#F9E2AF",
    "#94E2D5",
    "#B4BEFE",
]


def extract_latent_space(
    model: MultiViewAutoencoder,
    frames: Mapping[str, pd.DataFrame],
    batch_size: int = 128,
) -> pd.DataFrame:
    dataset = MultiOmicsTensorDataset(frames)
    loader = torch.utils.data.DataLoader(dataset, batch_size=batch_size, shuffle=False)
    device = next(model.parameters()).device
    latent_batches: list[np.ndarray] = []

    model.eval()
    with torch.no_grad():
        for batch in loader:
            inputs = tuple(view.to(device) for view in batch)
            latent = model.encode(*inputs)
            latent_batches.append(latent.cpu().numpy())

    latent_matrix = np.vstack(latent_batches)
    columns = [f"latent_{idx:03d}" for idx in range(latent_matrix.shape[1])]
    return pd.DataFrame(latent_matrix, index=dataset.sample_ids, columns=columns)


def cluster_latent_space(
    latent: pd.DataFrame,
    method: str = "kmeans",
    n_clusters: int = 4,
    random_state: int = 42,
) -> tuple[np.ndarray, float | None]:
    if method == "kmeans":
        clusterer = KMeans(n_clusters=n_clusters, random_state=random_state, n_init="auto")
        labels = clusterer.fit_predict(latent.values)
    elif method == "spectral":
        clusterer = SpectralClustering(
            n_clusters=n_clusters,
            random_state=random_state,
            affinity="nearest_neighbors",
            assign_labels="kmeans",
        )
        labels = clusterer.fit_predict(latent.values)
    else:
        raise ValueError(f"Unsupported clustering method: {method}")

    score = None
    if len(set(labels)) > 1 and len(latent) > n_clusters:
        score = float(silhouette_score(latent.values, labels))
    return labels, score


def compute_embedding(
    latent: pd.DataFrame,
    random_state: int = 42,
    n_components: int = 2,
) -> pd.DataFrame:
    try:
        import umap

        reducer = umap.UMAP(
            n_components=n_components,
            random_state=random_state,
            metric="cosine",
            n_neighbors=min(15, max(2, len(latent) - 1)),
        )
        coords = reducer.fit_transform(latent.values)
        method = "UMAP"
    except Exception:
        perplexity = max(2, min(30, (len(latent) - 1) // 3))
        reducer = TSNE(
            n_components=n_components,
            random_state=random_state,
            init="pca",
            learning_rate="auto",
            perplexity=perplexity,
        )
        coords = reducer.fit_transform(latent.values)
        method = "t-SNE"

    columns = ["x", "y"] if n_components == 2 else ["x", "y", "z"]
    embedding = pd.DataFrame(coords, index=latent.index, columns=columns)
    embedding.attrs["method"] = method
    return embedding


def infer_cluster_marker_genes(
    transcriptomics: pd.DataFrame,
    labels: np.ndarray,
    top_n: int = 40,
) -> dict[int, list[str]]:
    markers: dict[int, list[str]] = {}
    label_series = pd.Series(labels, index=transcriptomics.index)
    for cluster_id in sorted(label_series.unique()):
        in_cluster = transcriptomics.loc[label_series == cluster_id]
        out_cluster = transcriptomics.loc[label_series != cluster_id]
        delta = in_cluster.mean(axis=0) - out_cluster.mean(axis=0)
        markers[int(cluster_id)] = delta.sort_values(ascending=False).head(top_n).index.tolist()
    return markers


def run_kegg_enrichment(
    cluster_markers: Mapping[int, list[str]],
    gene_set: str = "KEGG_2021_Human",
    organism: str = "Human",
) -> list[dict]:
    try:
        import gseapy as gp
    except ImportError:
        return []

    results: list[dict] = []
    for cluster_id, genes in cluster_markers.items():
        if not genes:
            continue
        try:
            enrichment = gp.enrichr(
                gene_list=genes,
                gene_sets=[gene_set],
                organism=organism,
                outdir=None,
                no_plot=True,
            )
        except Exception:
            continue

        if enrichment.results is None or enrichment.results.empty:
            continue

        for _, row in enrichment.results.head(8).iterrows():
            results.append(
                {
                    "cluster": int(cluster_id),
                    "term": str(row.get("Term", "")),
                    "adjusted_p_value": (
                        float(row["Adjusted P-value"])
                        if pd.notna(row.get("Adjusted P-value"))
                        else None
                    ),
                    "overlap": str(row.get("Overlap", "")),
                    "genes": str(row.get("Genes", "")).split(";") if row.get("Genes") else [],
                }
            )
    return results


def cluster_counts(labels: np.ndarray) -> dict[str, int]:
    return {str(label): count for label, count in sorted(Counter(labels).items())}
