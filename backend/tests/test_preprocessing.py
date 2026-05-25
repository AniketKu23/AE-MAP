import numpy as np

from app.ml.preprocessing import generate_demo_omics, preprocess_tcga_data


def test_demo_preprocessing_removes_missing_values() -> None:
    frames = generate_demo_omics(n_samples=12, n_genomics=8, n_transcriptomics=9, n_proteomics=5)
    processed, _ = preprocess_tcga_data(frames, knn_neighbors=3)

    assert set(processed) == {"genomics", "transcriptomics", "proteomics"}
    assert all(frame.shape[0] == 12 for frame in processed.values())
    assert all(not np.isnan(frame.values).any() for frame in processed.values())
