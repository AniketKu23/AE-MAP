from fastapi import APIRouter, HTTPException

from app.schemas import ClusterRequest, ClusterResponse
from app.services.pipeline_service import pipeline_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.post("/cluster", response_model=ClusterResponse)
def cluster(request: ClusterRequest) -> ClusterResponse:
    try:
        return pipeline_service.cluster(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
