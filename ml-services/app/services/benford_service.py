import math
from collections import Counter

import numpy as np
from scipy import stats

from app.models.schemas import BenfordRequest, BenfordResult

# Benford's Law expected first-digit distribution
BENFORD_EXPECTED: dict[int, float] = {
    d: math.log10(1 + 1 / d) for d in range(1, 10)
}


def _first_digit(n: float) -> int | None:
    """Extract the first significant digit from a number."""
    if n <= 0:
        return None
    s = f"{n:.10f}".lstrip("0").lstrip(".")
    for ch in s:
        if ch.isdigit() and ch != "0":
            return int(ch)
    return None


def analyze_benford(request: BenfordRequest) -> BenfordResult:
    """Analyze a set of amounts using Benford's Law first-digit test."""
    amounts = [a for a in request.amounts if a > 0]
    if len(amounts) < 10:
        raise ValueError("At least 10 positive amounts are required for Benford analysis")

    # Extract first digits
    first_digits = [_first_digit(a) for a in amounts]
    valid_digits = [d for d in first_digits if d is not None]
    total = len(valid_digits)

    if total < 10:
        raise ValueError("Not enough valid first digits for analysis")

    # Count observed distribution
    counts = Counter(valid_digits)
    observed = np.array([counts.get(d, 0) for d in range(1, 10)])
    observed_freq = observed / total

    # Expected distribution
    expected_freq = np.array([BENFORD_EXPECTED[d] for d in range(1, 10)])
    expected_counts = expected_freq * total

    # Chi-squared test
    chi2, p_value = stats.chisquare(observed, f_exp=expected_counts)

    # Mean Absolute Deviation
    mad = float(np.mean(np.abs(observed_freq - expected_freq)))

    # Determine anomalous digits (>2 standard deviations from expected)
    anomalous_digits: list[int] = []
    for d in range(1, 10):
        idx = d - 1
        expected_p = expected_freq[idx]
        observed_p = observed_freq[idx]
        std = math.sqrt(expected_p * (1 - expected_p) / total)
        if std > 0 and abs(observed_p - expected_p) > 2 * std:
            anomalous_digits.append(d)

    # Determine if anomalous (MAD > 0.015 is "nonconforming" per Nigrini)
    is_anomalous = mad > 0.015 or p_value < 0.05

    # Confidence based on MAD
    confidence = min(1.0, mad / 0.03) if is_anomalous else max(0.0, 1.0 - mad / 0.015)

    return BenfordResult(
        is_anomalous=is_anomalous,
        chi_squared=round(float(chi2), 4),
        p_value=round(float(p_value), 6),
        mad=round(mad, 6),
        digit_distribution={str(d): round(float(observed_freq[d - 1]), 4) for d in range(1, 10)},
        expected_distribution={str(d): round(BENFORD_EXPECTED[d], 4) for d in range(1, 10)},
        confidence=round(confidence, 4),
        anomalous_digits=anomalous_digits,
    )
