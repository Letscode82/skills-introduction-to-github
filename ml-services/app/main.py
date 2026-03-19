from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import ocr, benford, statistical

app = FastAPI(
    title="Sentinel AI ML Services",
    description="OCR, Benford's Law analysis, and statistical analysis for fraud detection",
    version="5.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr.router, prefix="/api/ml", tags=["OCR"])
app.include_router(benford.router, prefix="/api/ml", tags=["Benford Analysis"])
app.include_router(statistical.router, prefix="/api/ml", tags=["Statistical Analysis"])


@app.get("/api/ml/health")
async def health() -> dict[str, str]:
    return {"status": "healthy", "version": "5.0.0"}
