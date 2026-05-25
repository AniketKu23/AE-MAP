from dataclasses import dataclass
from pathlib import Path
from typing import Mapping

import numpy as np
import pandas as pd
from sklearn.impute import KNNImputer
from sklearn.preprocessing import StandardScaler


OMICS_KEYS = ("genomics", "transcriptomics", "proteomics")


@dataclass
class PreprocessingArtifacts:
    imputers: dict[str, KNNImputer]
    scalers: dict[str, StandardScaler]


def read_tcga_table(path: str | Path) -> pd.DataFrame:
    """Read a TCGA-like omics matrix with sample IDs in the first column."""
    table = pd.read_csv(path, sep=None, engine="python", index_col=0)
    if table.empty:
        raise ValueError(f"No rows found in {path}.")

    numeric = table.apply(pd.to_numeric, errors="coerce")
    numeric.index = numeric.index.astype(str)
    numeric = numeric.loc[:, numeric.notna().any(axis=0)]
    if numeric.empty:
        raise ValueError(f"No numeric feature columns found in {path}.")
    return numeric


def ingest_tcga_data(
    genomics_path: str | Path,
    transcriptomics_path: str | Path,
    proteomics_path: str | Path,
) -> dict[str, pd.DataFrame]:
    return {
        "genomics": read_tcga_table(genomics_path),
        "transcriptomics": read_tcga_table(transcriptomics_path),
        "proteomics": read_tcga_table(proteomics_path),
    }


def align_omics_samples(frames: Mapping[str, pd.DataFrame]) -> dict[str, pd.DataFrame]:
    missing = [key for key in OMICS_KEYS if key not in frames]
    if missing:
        raise ValueError(f"Missing omics views: {', '.join(missing)}")

    common_samples = set(frames["genomics"].index)
    for key in OMICS_KEYS[1:]:
        common_samples &= set(frames[key].index)

    if not common_samples:
        raise ValueError("No shared sample IDs across the three omics matrices.")

    ordered_samples = sorted(common_samples)
    return {
        key: frames[key].loc[ordered_samples].sort_index(axis=1)
        for key in OMICS_KEYS
    }


def normalize_omics_views(
    frames: Mapping[str, pd.DataFrame],
    knn_neighbors: int = 5,
) -> tuple[dict[str, pd.DataFrame], PreprocessingArtifacts]:
    aligned = align_omics_samples(frames)
    normalized: dict[str, pd.DataFrame] = {}
    imputers: dict[str, KNNImputer] = {}
    scalers: dict[str, StandardScaler] = {}

    for key, frame in aligned.items():
        neighbors = min(knn_neighbors, max(1, len(frame) - 1))
        imputer = KNNImputer(n_neighbors=neighbors)
        scaler = StandardScaler()

        imputed = imputer.fit_transform(frame)
        scaled = scaler.fit_transform(imputed)
        normalized[key] = pd.DataFrame(scaled, index=frame.index, columns=frame.columns)
        imputers[key] = imputer
        scalers[key] = scaler

    return normalized, PreprocessingArtifacts(imputers=imputers, scalers=scalers)


def preprocess_tcga_data(
    frames: Mapping[str, pd.DataFrame],
    knn_neighbors: int = 5,
    sample_limit: int | None = None,
) -> tuple[dict[str, pd.DataFrame], PreprocessingArtifacts]:
    normalized, artifacts = normalize_omics_views(frames, knn_neighbors=knn_neighbors)
    if sample_limit is not None:
        normalized = {key: frame.iloc[:sample_limit].copy() for key, frame in normalized.items()}
    return normalized, artifacts


def generate_demo_omics(
    n_samples: int = 120,
    n_genomics: int = 180,
    n_transcriptomics: int = 240,
    n_proteomics: int = 96,
    n_clusters: int = 4,
    missing_rate: float = 0.04,
    seed: int = 42,
) -> dict[str, pd.DataFrame]:
    """Create a deterministic synthetic multi-omics cohort for local development."""
    rng = np.random.default_rng(seed)
    cluster_ids = rng.integers(0, n_clusters, size=n_samples)
    sample_ids = [f"TCGA-DEMO-{idx:04d}" for idx in range(n_samples)]

    def make_view(prefix: str, n_features: int, signal_scale: float) -> pd.DataFrame:
        centers = rng.normal(0, signal_scale, size=(n_clusters, n_features))
        data = centers[cluster_ids] + rng.normal(0, 1.0, size=(n_samples, n_features))
        mask = rng.random(data.shape) < missing_rate
        data[mask] = np.nan
        return pd.DataFrame(
            data,
            index=sample_ids,
            columns=[f"{prefix}_{idx:04d}" for idx in range(n_features)],
        )

    return {
        "genomics": make_view("CNV", n_genomics, 1.5),
        "transcriptomics": make_view("GENE", n_transcriptomics, 2.0),
        "proteomics": make_view("PROT", n_proteomics, 1.2),
    }
