from typing import Literal

from pydantic import BaseModel, Field


class OmicsFilePaths(BaseModel):
    genomics_path: str = Field(..., description="CSV/TSV path with samples as rows.")
    transcriptomics_path: str = Field(..., description="CSV/TSV path with samples as rows.")
    proteomics_path: str = Field(..., description="CSV/TSV path with samples as rows.")


class PreprocessRequest(BaseModel):
    files: OmicsFilePaths | None = None
    use_demo_data: bool = Field(
        default=True,
        description="Generate a deterministic synthetic cohort when files are not provided.",
    )
    sample_limit: int | None = Field(default=None, ge=3)
    knn_neighbors: int = Field(default=5, ge=1, le=25)


class PreprocessResponse(BaseModel):
    status: str
    samples: int
    feature_counts: dict[str, int]
    sample_ids: list[str]


class TrainRequest(BaseModel):
    epochs: int = Field(default=25, ge=1, le=1000)
    batch_size: int = Field(default=32, ge=2, le=512)
    learning_rate: float = Field(default=1e-3, gt=0, le=1)
    latent_dim: int = Field(default=128, ge=2, le=1024)
    hidden_dim: int = Field(default=256, ge=8, le=2048)
    seed: int = 42


class TrainingMetrics(BaseModel):
    epoch_loss: list[float]
    final_loss: float


class TrainResponse(BaseModel):
    status: str
    latent_dim: int
    metrics: TrainingMetrics


class ClusterRequest(BaseModel):
    method: Literal["kmeans", "spectral"] = "kmeans"
    n_clusters: int = Field(default=4, ge=2, le=20)
    random_state: int = 42


class PathwayResult(BaseModel):
    cluster: int
    term: str
    adjusted_p_value: float | None = None
    overlap: str | None = None
    genes: list[str] = []


class ClusterResponse(BaseModel):
    status: str
    method: str
    n_clusters: int
    silhouette_score: float | None = None
    cluster_counts: dict[str, int]
    pathways: list[PathwayResult] = []


class VisualizationPoint(BaseModel):
    sample_id: str
    x: float
    y: float
    z: float | None = None
    cluster: int | None = None


class VisualizationResponse(BaseModel):
    points: list[VisualizationPoint]
    pathways: list[PathwayResult]
    plotly_layout: dict


class PipelineStatus(BaseModel):
    preprocessed: bool
    trained: bool
    clustered: bool
    samples: int = 0
    feature_counts: dict[str, int] = {}
    clusters: dict[str, int] = {}
