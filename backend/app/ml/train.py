from collections.abc import Mapping

import numpy as np
import pandas as pd
import torch
from torch.utils.data import DataLoader

from app.ml.datasets import MultiOmicsTensorDataset, infer_input_dims
from app.ml.model import MultiViewAutoencoder, multiview_mse_loss


def set_torch_seed(seed: int) -> None:
    torch.manual_seed(seed)
    np.random.seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)


def train_autoencoder(
    frames: Mapping[str, pd.DataFrame],
    epochs: int = 25,
    batch_size: int = 32,
    learning_rate: float = 1e-3,
    latent_dim: int = 128,
    hidden_dim: int = 256,
    seed: int = 42,
) -> tuple[MultiViewAutoencoder, dict[str, list[float] | float]]:
    set_torch_seed(seed)
    dataset = MultiOmicsTensorDataset(frames)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True, drop_last=False)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = MultiViewAutoencoder(
        *infer_input_dims(frames),
        hidden_dim=hidden_dim,
        latent_dim=latent_dim,
    ).to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=learning_rate, weight_decay=1e-4)

    epoch_loss: list[float] = []
    for _ in range(epochs):
        model.train()
        running_loss = 0.0
        for batch in loader:
            targets = tuple(view.to(device) for view in batch)
            optimizer.zero_grad(set_to_none=True)
            reconstructions, _ = model(*targets)
            loss = multiview_mse_loss(reconstructions, targets)
            loss.backward()
            optimizer.step()
            running_loss += loss.item() * targets[0].shape[0]
        epoch_loss.append(running_loss / len(dataset))

    metrics = {
        "epoch_loss": epoch_loss,
        "final_loss": epoch_loss[-1],
    }
    return model, metrics
