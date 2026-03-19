import pytest

from app.models.schemas import StatisticalRequest
from app.services.statistical_service import analyze_statistical


def test_outlier_detection_normal() -> None:
    """Normal data should have few outliers."""
    values = [10.0, 11.0, 12.0, 10.5, 11.5, 12.5, 10.2, 11.8, 12.1, 10.8]
    request = StatisticalRequest(values=values, analysis_type="outlier")
    result = analyze_statistical(request)
    assert len(result.outliers) == 0
    assert not result.is_anomalous


def test_outlier_detection_with_outliers() -> None:
    """Data with extreme values should detect outliers."""
    values = [10.0, 11.0, 12.0, 10.5, 11.5, 100.0, 10.2, 11.8, 200.0, 10.8]
    request = StatisticalRequest(values=values, analysis_type="outlier")
    result = analyze_statistical(request)
    assert len(result.outliers) > 0


def test_trend_analysis_increasing() -> None:
    """Increasing trend should be detected."""
    values = [10.0, 20.0, 30.0, 40.0, 50.0, 60.0, 70.0, 80.0]
    request = StatisticalRequest(values=values, analysis_type="trend")
    result = analyze_statistical(request)
    assert result.details["trend_direction"] == "increasing"
    assert not result.is_anomalous


def test_trend_analysis_decreasing() -> None:
    """Decreasing trend should be flagged as anomalous."""
    values = [80.0, 70.0, 60.0, 50.0, 40.0, 30.0, 20.0, 10.0]
    request = StatisticalRequest(values=values, analysis_type="trend")
    result = analyze_statistical(request)
    assert result.details["trend_direction"] == "decreasing"
    assert result.is_anomalous
