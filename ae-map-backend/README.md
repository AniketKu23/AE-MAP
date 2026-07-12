# AE-MAP Backend

This is the Python backend for the AE-MAP multi-omics project.

## Requirements

1. Python 3.10+
2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Pipeline

1. **Place Data**: Ensure the following files from TCGA/cBioPortal are placed in `data/raw/`:
   - `data_mutations.txt`
   - `data_mrna_seq_v2_rsem.txt`
   - `data_rppa.txt`
   - `data_clinical_patient.txt`
   - `data_clinical_sample.txt`
   *(Alternatively, run `python generate_mock_data.py` to create dummy datasets for testing).*

2. **Preprocess**:
```bash
python src/preprocessing.py
```
   This will align patients, split train/val/test, scale, impute, and save to `data/processed/`.

3. **Train Model**:
```bash
python src/train.py --epochs 50 --batch_size 16
```
   This trains the Multi-View Autoencoder and saves the best model to `models/best_model.pth`.

4. **Analyze Results**:
```bash
python src/analyze.py
python src/pathways.py
python src/survival.py
python src/explain.py
```
   This extracts the latent vectors, clusters patients, and generates all the JSON outputs in `results/`.

5. **Start API**:
```bash
uvicorn api.main:app --reload
```
   The API will be available at `http://localhost:8000`.

## API Endpoints
- `GET /api/clusters`
- `GET /api/metrics`
- `GET /api/pathways/{cluster_id}`
- `GET /api/survival/{cluster_id}`
- `GET /api/gene-importance/{cluster_id}`
