import numpy as np

from app.models.schemas import StatisticalRequest, StatisticalResult


def analyze_statistical(request: StatisticalRequest) -> StatisticalResult:
    """Perform statistical analysis to detect anomalies in numerical data."""
    values = np.array(request.values)
    analysis_type = request.analysis_type

    if analysis_type == "outlier":
        return _detect_outliers(values)
    elif analysis_type == "trend":
        return _analyze_trend(values)
    else:
        return _detect_outliers(values)


def _detect_outliers(values: np.ndarray) -> StatisticalResult:
    """Detect outliers using IQR method and Z-score."""
    q1 = float(np.percentile(values, 25))
    q3 = float(np.percentile(values, 75))
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr

    outlier_indices = [
        int(i) for i, v in enumerate(values) if v < lower_bound or v > upper_bound
    ]

    mean = float(np.mean(values))
    std = float(np.std(values))
    z_scores = ((values - mean) / std if std > 0 else np.zeros_like(values)).tolist()

    outlier_pct = len(outlier_indices) / len(values) * 100
    is_anomalous = outlier_pct > 5.0
    score = min(100.0, outlier_pct * 10)

    return StatisticalResult(
        analysis_type="outlier",
        is_anomalous=is_anomalous,
        score=round(score, 2),
        details={
            "mean": round(mean, 2),
            "std": round(std, 2),
            "q1": round(q1, 2),
            "q3": round(q3, 2),
            "iqr": round(iqr, 2),
            "lower_bound": round(lower_bound, 2),
            "upper_bound": round(upper_bound, 2),
            "outlier_count": len(outlier_indices),
            "outlier_pct": round(outlier_pct, 2),
        },
        outliers=outlier_indices,
        confidence=round(min(1.0, len(values) / 100), 4),
    )


def _analyze_trend(values: np.ndarray) -> StatisticalResult:
    """Analyze trend using linear regression."""
    x = np.arange(len(values), dtype=float)
    coeffs = np.polyfit(x, values, 1)
    slope = float(coeffs[0])
    intercept = float(coeffs[1])

    predicted = np.polyval(coeffs, x)
    residuals = values - predicted
    r_squared = 1.0 - (float(np.sum(residuals**2)) / float(np.sum((values - np.mean(values))**2) + 1e-10))

    # Anomalous if strong negative trend
    is_anomalous = slope < 0 and abs(r_squared) > 0.5
    score = min(100.0, abs(slope) * 50)

    return StatisticalResult(
        analysis_type="trend",
        is_anomalous=is_anomalous,
        score=round(score, 2),
        details={
            "slope": round(slope, 4),
            "intercept": round(intercept, 4),
            "r_squared": round(r_squared, 4),
            "trend_direction": "increasing" if slope > 0 else "decreasing",
        },
        outliers=[],
        confidence=round(abs(r_squared), 4),
    )
