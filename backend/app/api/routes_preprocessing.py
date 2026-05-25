from fastapi import APIRouter, HTTPException

from app.schemas import PreprocessRequest, PreprocessResponse
from app.services.pipeline_service import pipeline_service

router = APIRouter(prefix="/preprocessing", tags=["preprocessing"])


@router.post("", response_model=PreprocessResponse)
def preprocess(request: PreprocessRequest) -> PreprocessResponse:
    try:
        return pipeline_service.preprocess(request)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
