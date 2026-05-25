# AE-MAP

AE-MAP is the AutoEncoder Multi-omics Analytics Pipeline. It ingests heterogeneous omics matrices, independently imputes and normalizes each view, fuses the views with a PyTorch multi-view autoencoder, clusters the latent space, and exposes the results through a dark pastel Next.js dashboard.

## Monorepo Layout

```txt
backend/   FastAPI, PyTorch, scikit-learn, GSEApy
frontend/  Next.js, Tailwind CSS, Plotly.js
```

## Local Development

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The dashboard expects the API at `http://localhost:8000/api/v1`. Override it with `NEXT_PUBLIC_API_BASE_URL` when needed.

## API Slice

- `POST /api/v1/preprocessing` ingests provided CSV/TSV matrices or generates demo data.
- `POST /api/v1/training` trains the multi-view autoencoder and extracts latent vectors.
- `POST /api/v1/analytics/cluster` clusters latent vectors and attempts KEGG enrichment.
- `GET /api/v1/visualization` returns Plotly-ready coordinates and pathway results.
- `GET /api/v1/status` returns current pipeline state.

## Input Matrix Shape

Each omics file should be a CSV or TSV matrix with sample IDs in the first column and numeric features in the remaining columns.

```txt
sample_id,GENE_001,GENE_002,GENE_003
TCGA-01,12.2,9.4,
TCGA-02,10.1,8.7,3.2
```

Missing numeric values are handled with `KNNImputer`; each omics view is Z-score normalized with an independent `StandardScaler`.
