from fastapi import APIRouter, HTTPException

from app.schemas import PipelineStatus, VisualizationResponse
from app.services.pipeline_service import pipeline_service

router = APIRouter(tags=["visualization"])


@router.get("/visualization", response_model=VisualizationResponse)
def visualization() -> VisualizationResponse:
    try:
        return pipeline_service.visualization()
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.get("/status", response_model=PipelineStatus)
def status() -> PipelineStatus:
    return pipeline_service.status()
