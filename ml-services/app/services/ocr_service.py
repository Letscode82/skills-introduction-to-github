from app.models.schemas import OcrRequest, OcrResult


async def analyze_document(request: OcrRequest) -> OcrResult:
    """Analyze document using OCR. In production, uses Tesseract + custom ML models."""
    # Placeholder — real implementation would use pytesseract + PIL + custom tampering model
    fields: dict[str, str] = {}
    tampering_detected = False
    tampering_confidence = 0.0

    if request.document_type == "invoice":
        fields = {
            "invoice_number": "INV-2026-0001",
            "vendor_name": "Sample Vendor Ltd",
            "amount": "₹1,50,000.00",
            "date": "2026-03-15",
            "gst_number": "27AAACR5055K1ZK",
        }
    elif request.document_type == "receipt":
        fields = {
            "receipt_number": "RCT-2026-001",
            "merchant": "Hotel Grand",
            "amount": "₹12,500.00",
            "date": "2026-03-10",
        }
    elif request.document_type == "id_document":
        fields = {
            "document_type": "PAN Card",
            "name": "REDACTED",
            "number": "REDACTED",
        }

    return OcrResult(
        text="[OCR extracted text placeholder — requires Tesseract installation]",
        confidence=0.92,
        fields=fields,
        tampering_detected=tampering_detected,
        tampering_confidence=tampering_confidence,
        metadata={"engine": "tesseract", "document_type": request.document_type},
    )
