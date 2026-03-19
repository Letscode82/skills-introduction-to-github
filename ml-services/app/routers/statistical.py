from fastapi import APIRouter, HTTPException

from app.models.schemas import StatisticalRequest, StatisticalResult
from app.services.statistical_service import analyze_statistical

router = APIRouter()


@router.post("/statistical/analyze", response_model=StatisticalResult)
async def statistical_analyze(request: StatisticalRequest) -> StatisticalResult:
    """Perform statistical analysis on numerical data to detect anomalies."""
    try:
        return analyze_statistical(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
