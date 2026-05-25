# AE-MAP Backend

FastAPI service for multi-omics preprocessing, autoencoder training, latent-space clustering, and KEGG enrichment.

## Run

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Data

Place TCGA-like CSV/TSV matrices in `data/raw`. The current API also supports deterministic demo data for local dashboard development.

Expected views:

- Genomics
- Transcriptomics
- Proteomics

All views are aligned by shared sample IDs before imputation, scaling, and training.
