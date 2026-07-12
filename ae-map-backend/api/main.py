from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

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
