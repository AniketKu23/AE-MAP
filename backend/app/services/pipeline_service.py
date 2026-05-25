from dataclasses import dataclass, field

import pandas as pd
import torch

from app.config import get_settings
from app.ml.analytics import (
    cluster_counts,
    cluster_latent_space,
    compute_embedding,
    extract_latent_space,
    infer_cluster_marker_genes,
    run_kegg_enrichment,
)
from app.ml.model import MultiViewAutoencoder
from app.ml.preprocessing import (
    PreprocessingArtifacts,
    generate_demo_omics,
    ingest_tcga_data,
    preprocess_tcga_data,
)
from app.ml.train import train_autoencoder
from app.schemas import (
    ClusterRequest,
    ClusterResponse,
    PathwayResult,
    PipelineStatus,
    PreprocessRequest,
    PreprocessResponse,
    TrainRequest,
    TrainingMetrics,
    TrainResponse,
    VisualizationPoint,
    VisualizationResponse,
)


@dataclass
class PipelineState:
    processed_frames: dict[str, pd.DataFrame] | None = None
    preprocessing_artifacts: PreprocessingArtifacts | None = None
    model: MultiViewAutoencoder | None = None
    training_metrics: dict | None = None
    latent: pd.DataFrame | None = None
    labels: list[int] | None = None
    embedding: pd.DataFrame | None = None
    pathways: list[dict] = field(default_factory=list)


class PipelineService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.state = PipelineState()

    def preprocess(self, request: PreprocessRequest) -> PreprocessResponse:
        if request.files is not None:
            frames = ingest_tcga_data(
                request.files.genomics_path,
                request.files.transcriptomics_path,
                request.files.proteomics_path,
            )
        elif request.use_demo_data:
            frames = generate_demo_omics()
        else:
            raise ValueError("Provide omics file paths or enable use_demo_data.")

        processed, artifacts = preprocess_tcga_data(
            frames,
            knn_neighbors=request.knn_neighbors,
            sample_limit=request.sample_limit,
        )
        self.state = PipelineState(
            processed_frames=processed,
            preprocessing_artifacts=artifacts,
        )

        for key, frame in processed.items():
            frame.to_csv(self.settings.processed_data_dir / f"{key}_normalized.csv")

        sample_ids = list(processed["genomics"].index)
        return PreprocessResponse(
            status="preprocessed",
            samples=len(sample_ids),
            feature_counts={key: frame.shape[1] for key, frame in processed.items()},
            sample_ids=sample_ids[:20],
        )

    def train(self, request: TrainRequest) -> TrainResponse:
        if self.state.processed_frames is None:
            raise ValueError("Run preprocessing before training.")

        model, metrics = train_autoencoder(
            self.state.processed_frames,
            epochs=request.epochs,
            batch_size=request.batch_size,
            learning_rate=request.learning_rate,
            latent_dim=request.latent_dim,
            hidden_dim=request.hidden_dim,
            seed=request.seed,
        )
        latent = extract_latent_space(model, self.state.processed_frames)

        self.state.model = model
        self.state.training_metrics = metrics
        self.state.latent = latent
        self.state.labels = None
        self.state.embedding = None
        self.state.pathways = []

        latent.to_csv(self.settings.output_dir / "latent_space.csv")
        torch.save(model.state_dict(), self.settings.checkpoint_dir / "multiview_autoencoder.pt")

        return TrainResponse(
            status="trained",
            latent_dim=request.latent_dim,
            metrics=TrainingMetrics(
                epoch_loss=[float(value) for value in metrics["epoch_loss"]],
                final_loss=float(metrics["final_loss"]),
            ),
        )

    def cluster(self, request: ClusterRequest) -> ClusterResponse:
        if self.state.latent is None or self.state.processed_frames is None:
            raise ValueError("Train the autoencoder before clustering.")

        labels, score = cluster_latent_space(
            self.state.latent,
            method=request.method,
            n_clusters=request.n_clusters,
            random_state=request.random_state,
        )
        embedding = compute_embedding(self.state.latent, random_state=request.random_state)
        markers = infer_cluster_marker_genes(
            self.state.processed_frames["transcriptomics"],
            labels,
        )
        pathways = run_kegg_enrichment(markers)

        self.state.labels = [int(label) for label in labels]
        self.state.embedding = embedding
        self.state.pathways = pathways

        output = embedding.copy()
        output["cluster"] = labels
        output.to_csv(self.settings.output_dir / "latent_embedding_clusters.csv")

        return ClusterResponse(
            status="clustered",
            method=request.method,
            n_clusters=request.n_clusters,
            silhouette_score=score,
            cluster_counts=cluster_counts(labels),
            pathways=[PathwayResult(**item) for item in pathways],
        )

    def visualization(self) -> VisualizationResponse:
        if self.state.latent is None:
            raise ValueError("Train the autoencoder before requesting visualization data.")

        if self.state.embedding is None:
            self.state.embedding = compute_embedding(self.state.latent)

        labels = self.state.labels or [None] * len(self.state.embedding)
        points = [
            VisualizationPoint(
                sample_id=str(sample_id),
                x=float(row["x"]),
                y=float(row["y"]),
                z=float(row["z"]) if "z" in row else None,
                cluster=labels[idx],
            )
            for idx, (sample_id, row) in enumerate(self.state.embedding.iterrows())
        ]

        return VisualizationResponse(
            points=points,
            pathways=[PathwayResult(**item) for item in self.state.pathways],
            plotly_layout={
                "paper_bgcolor": "rgba(0,0,0,0)",
                "plot_bgcolor": "rgba(0,0,0,0)",
                "font": {"color": "#CDD6F4", "family": "Inter, sans-serif"},
                "xaxis": {"gridcolor": "#45475A", "zerolinecolor": "#585B70"},
                "yaxis": {"gridcolor": "#45475A", "zerolinecolor": "#585B70"},
                "margin": {"l": 40, "r": 24, "t": 24, "b": 40},
            },
        )

    def status(self) -> PipelineStatus:
        frames = self.state.processed_frames
        labels = self.state.labels
        return PipelineStatus(
            preprocessed=frames is not None,
            trained=self.state.model is not None,
            clustered=labels is not None,
            samples=len(frames["genomics"]) if frames else 0,
            feature_counts={key: frame.shape[1] for key, frame in frames.items()} if frames else {},
            clusters={str(label): labels.count(label) for label in sorted(set(labels))} if labels else {},
        )


pipeline_service = PipelineService()
