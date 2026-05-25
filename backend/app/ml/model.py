import torch
from torch import nn
from torch.nn import functional as F


class MultiViewAutoencoder(nn.Module):
    """Three-view autoencoder for genomics, transcriptomics, and proteomics."""

    def __init__(
        self,
        genomics_dim: int,
        transcriptomics_dim: int,
        proteomics_dim: int,
        hidden_dim: int = 256,
        latent_dim: int = 128,
        dropout: float = 0.1,
    ) -> None:
        super().__init__()
        self.input_dims = {
            "genomics": genomics_dim,
            "transcriptomics": transcriptomics_dim,
            "proteomics": proteomics_dim,
        }
        branch_dim = max(32, hidden_dim // 2)

        self.genomics_encoder = self._encoder_branch(genomics_dim, hidden_dim, branch_dim, dropout)
        self.transcriptomics_encoder = self._encoder_branch(
            transcriptomics_dim,
            hidden_dim,
            branch_dim,
            dropout,
        )
        self.proteomics_encoder = self._encoder_branch(proteomics_dim, hidden_dim, branch_dim, dropout)

        self.shared_encoder = nn.Sequential(
            nn.Linear(branch_dim * 3, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, latent_dim),
        )

        self.shared_decoder = nn.Sequential(
            nn.Linear(latent_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, branch_dim * 3),
            nn.GELU(),
        )

        self.genomics_decoder = self._decoder_branch(branch_dim, hidden_dim, genomics_dim, dropout)
        self.transcriptomics_decoder = self._decoder_branch(
            branch_dim,
            hidden_dim,
            transcriptomics_dim,
            dropout,
        )
        self.proteomics_decoder = self._decoder_branch(branch_dim, hidden_dim, proteomics_dim, dropout)

    @staticmethod
    def _encoder_branch(input_dim: int, hidden_dim: int, output_dim: int, dropout: float) -> nn.Sequential:
        return nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, output_dim),
            nn.GELU(),
        )

    @staticmethod
    def _decoder_branch(input_dim: int, hidden_dim: int, output_dim: int, dropout: float) -> nn.Sequential:
        return nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, output_dim),
        )

    def encode(
        self,
        genomics: torch.Tensor,
        transcriptomics: torch.Tensor,
        proteomics: torch.Tensor,
    ) -> torch.Tensor:
        encoded = torch.cat(
            [
                self.genomics_encoder(genomics),
                self.transcriptomics_encoder(transcriptomics),
                self.proteomics_encoder(proteomics),
            ],
            dim=1,
        )
        return self.shared_encoder(encoded)

    def decode(self, latent: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        decoded = self.shared_decoder(latent)
        genomic_view, transcriptomic_view, proteomic_view = torch.chunk(decoded, chunks=3, dim=1)
        return (
            self.genomics_decoder(genomic_view),
            self.transcriptomics_decoder(transcriptomic_view),
            self.proteomics_decoder(proteomic_view),
        )

    def forward(
        self,
        genomics: torch.Tensor,
        transcriptomics: torch.Tensor,
        proteomics: torch.Tensor,
    ) -> tuple[tuple[torch.Tensor, torch.Tensor, torch.Tensor], torch.Tensor]:
        latent = self.encode(genomics, transcriptomics, proteomics)
        reconstructions = self.decode(latent)
        return reconstructions, latent


def multiview_mse_loss(
    reconstructions: tuple[torch.Tensor, torch.Tensor, torch.Tensor],
    targets: tuple[torch.Tensor, torch.Tensor, torch.Tensor],
    weights: tuple[float, float, float] = (1.0, 1.0, 1.0),
) -> torch.Tensor:
    losses = [
        weight * F.mse_loss(reconstructed, target)
        for reconstructed, target, weight in zip(reconstructions, targets, weights, strict=True)
    ]
    return sum(losses) / sum(weights)
