from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import asyncio

app = FastAPI(title="AE-MAP API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_json(cohort, filename):
    path = os.path.join('results', cohort, filename)
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail=f"Data not found: {filename} for {cohort}")
    with open(path, 'r') as f:
        return json.load(f)

@app.get("/api/clusters")
def get_clusters(cohort: str = "BRCA"):
    """Returns patient-level 2D coordinates + cluster labels"""
    return load_json(cohort, 'clusters.json')

@app.get("/api/metrics")
def get_metrics(cohort: str = "BRCA"):
    """Returns reconstruction accuracy, silhouette score, baseline comparison numbers"""
    return load_json(cohort, 'metrics.json')

@app.get("/api/pathways/{cluster_id}")
def get_pathways(cluster_id: str, cohort: str = "BRCA"):
    """Returns enriched pathways for a cluster"""
    data = load_json(cohort, 'pathways.json')
    if cluster_id not in data:
        raise HTTPException(status_code=404, detail="Cluster not found")
    return data[cluster_id]

@app.get("/api/survival/{cluster_id}")
def get_survival(cluster_id: str, cohort: str = "BRCA"):
    """Returns survival curve data + p-value"""
    data = load_json(cohort, 'survival.json')
    if cluster_id not in data:
        raise HTTPException(status_code=404, detail="Cluster not found")
    return data[cluster_id]

@app.get("/api/gene-importance/{cluster_id}")
def get_gene_importance(cluster_id: str, cohort: str = "BRCA"):
    """Returns top driving genes/proteins"""
    data = load_json(cohort, 'gene_importance.json')
    if cluster_id not in data:
        raise HTTPException(status_code=404, detail="Cluster not found")
    return data[cluster_id]

@app.post("/api/analyze-custom")
async def analyze_custom_data(
    dna_file: UploadFile = File(...),
    rna_file: UploadFile = File(...),
    protein_file: UploadFile = File(...)
):
    """
    Simulates parsing the uploaded CSVs and running the PyTorch inference pipeline.
    """
    # 1. Read files (simulate validation)
    dna_content = await dna_file.read()
    rna_content = await rna_file.read()
    protein_content = await protein_file.read()

    # Basic validation
    if not (dna_content and rna_content and protein_content):
        raise HTTPException(status_code=400, detail="One or more files are empty")

    # 2. Simulate processing delay for realistic UX (autoencoder inference + UMAP projection)
    await asyncio.sleep(2.5)

    # 3. Deterministic assignment based on file content length
    total_size = len(dna_content) + len(rna_content) + len(protein_content)
    cluster_id = total_size % 3

    # Load BRCA clusters to get the metadata to return
    clusters_data = load_json("BRCA", 'clusters.json')
    assigned_cluster = next((c for c in clusters_data if c["cluster_id"] == cluster_id), None)
    
    if not assigned_cluster:
        assigned_cluster = clusters_data[0]
        cluster_id = assigned_cluster["cluster_id"]

    # Mock 2D coordinates (center of the cluster)
    import numpy as np
    mock_x = float(np.mean(assigned_cluster["x"])) + np.random.normal(0, 0.5)
    mock_y = float(np.mean(assigned_cluster["y"])) + np.random.normal(0, 0.5)

    return {
        "status": "success",
        "cluster_id": cluster_id,
        "x": mock_x,
        "y": mock_y,
        "meta": assigned_cluster["meta"]
    }
