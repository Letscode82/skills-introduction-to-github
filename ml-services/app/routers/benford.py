from fastapi import APIRouter, HTTPException

from app.models.schemas import BenfordRequest, BenfordResult
from app.services.benford_service import analyze_benford

router = APIRouter()


@router.post("/benford/analyze", response_model=BenfordResult)
async def benford_analyze(request: BenfordRequest) -> BenfordResult:
    """Analyze transaction amounts using Benford's Law."""
    try:
        return analyze_benford(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
