from pydantic import BaseModel, Field


class OcrRequest(BaseModel):
    image_url: str = Field(..., description="URL or base64-encoded image data")
    document_type: str = Field(default="invoice", description="Type: invoice, receipt, id_document")


class OcrResult(BaseModel):
    text: str
    confidence: float = Field(ge=0.0, le=1.0)
    fields: dict[str, str]
    tampering_detected: bool
    tampering_confidence: float = Field(ge=0.0, le=1.0)
    metadata: dict[str, str | int | float] = Field(default_factory=dict)


class BenfordRequest(BaseModel):
    amounts: list[float] = Field(..., min_length=10, description="List of transaction amounts")
    entity_code: str | None = None
    module: str | None = None


class BenfordResult(BaseModel):
    is_anomalous: bool
    chi_squared: float
    p_value: float
    mad: float = Field(description="Mean Absolute Deviation from expected Benford distribution")
    digit_distribution: dict[str, float]
    expected_distribution: dict[str, float]
    confidence: float = Field(ge=0.0, le=1.0)
    anomalous_digits: list[int]


class StatisticalRequest(BaseModel):
    values: list[float] = Field(..., min_length=5)
    analysis_type: str = Field(default="outlier", description="Type: outlier, trend, cluster, correlation")
    context: dict[str, str | int | float] = Field(default_factory=dict)


class StatisticalResult(BaseModel):
    analysis_type: str
    is_anomalous: bool
    score: float = Field(ge=0.0, le=100.0)
    details: dict[str, float | int | str | list[float]]
    outliers: list[int] = Field(default_factory=list, description="Indices of outlier values")
    confidence: float = Field(ge=0.0, le=1.0)
