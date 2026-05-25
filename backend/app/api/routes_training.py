from fastapi import APIRouter, HTTPException

from app.schemas import TrainRequest, TrainResponse
from app.services.pipeline_service import pipeline_service

router = APIRouter(prefix="/training", tags=["training"])


@router.post("", response_model=TrainResponse)
def train(request: TrainRequest) -> TrainResponse:
    try:
        return pipeline_service.train(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
