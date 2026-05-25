from collections.abc import Mapping

import pandas as pd
import torch
from torch.utils.data import Dataset


class MultiOmicsTensorDataset(Dataset):
    def __init__(self, frames: Mapping[str, pd.DataFrame]) -> None:
        self.sample_ids = list(frames["genomics"].index)
        self.genomics = torch.tensor(frames["genomics"].values, dtype=torch.float32)
        self.transcriptomics = torch.tensor(frames["transcriptomics"].values, dtype=torch.float32)
        self.proteomics = torch.tensor(frames["proteomics"].values, dtype=torch.float32)

    def __len__(self) -> int:
        return len(self.sample_ids)

    def __getitem__(self, index: int) -> tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        return self.genomics[index], self.transcriptomics[index], self.proteomics[index]


def infer_input_dims(frames: Mapping[str, pd.DataFrame]) -> tuple[int, int, int]:
    return (
        frames["genomics"].shape[1],
        frames["transcriptomics"].shape[1],
        frames["proteomics"].shape[1],
    )
