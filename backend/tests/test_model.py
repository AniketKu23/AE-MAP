import torch

from app.ml.model import MultiViewAutoencoder, multiview_mse_loss


def test_multiview_autoencoder_forward_shapes() -> None:
    model = MultiViewAutoencoder(
        genomics_dim=10,
        transcriptomics_dim=12,
        proteomics_dim=8,
        hidden_dim=32,
        latent_dim=16,
    )
    inputs = (
        torch.randn(4, 10),
        torch.randn(4, 12),
        torch.randn(4, 8),
    )

    reconstructions, latent = model(*inputs)
    loss = multiview_mse_loss(reconstructions, inputs)

    assert latent.shape == (4, 16)
    assert [output.shape for output in reconstructions] == [view.shape for view in inputs]
    assert loss.item() >= 0
