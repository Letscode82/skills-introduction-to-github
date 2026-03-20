from fastapi import APIRouter, HTTPException

from app.models.schemas import OcrRequest, OcrResult
from app.services.ocr_service import analyze_document

router = APIRouter()


@router.post("/ocr/analyze", response_model=OcrResult)
async def ocr_analyze(request: OcrRequest) -> OcrResult:
    """Analyze a document image using OCR and detect tampering."""
    try:
        return await analyze_document(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
