import math

import pytest

from app.models.schemas import BenfordRequest
from app.services.benford_service import analyze_benford


def _benford_amounts(n: int = 200) -> list[float]:
    """Generate amounts that follow Benford's Law."""
    import random
    random.seed(42)
    amounts: list[float] = []
    for _ in range(n):
        # Log-uniform distribution naturally follows Benford's Law
        amounts.append(10 ** (random.uniform(1, 6)))
    return amounts


def _uniform_amounts(n: int = 200) -> list[float]:
    """Generate amounts that violate Benford's Law."""
    import random
    random.seed(42)
    return [random.uniform(100, 999) for _ in range(n)]


def test_benford_conforming() -> None:
    """Amounts following Benford's Law should not be flagged."""
    request = BenfordRequest(amounts=_benford_amounts())
    result = analyze_benford(request)
    assert not result.is_anomalous
    assert result.p_value > 0.05


def test_benford_non_conforming() -> None:
    """Uniform amounts should be flagged as anomalous."""
    request = BenfordRequest(amounts=_uniform_amounts())
    result = analyze_benford(request)
    assert result.is_anomalous
    assert result.mad > 0.015


def test_benford_too_few_amounts() -> None:
    """Should raise ValueError for fewer than 10 amounts."""
    request = BenfordRequest(amounts=[100.0, 200.0, 300.0])
    with pytest.raises(ValueError, match="At least 10"):
        analyze_benford(request)


def test_benford_digit_distribution_sums_to_one() -> None:
    """Digit distribution should sum to approximately 1."""
    request = BenfordRequest(amounts=_benford_amounts())
    result = analyze_benford(request)
    total = sum(result.digit_distribution.values())
    assert abs(total - 1.0) < 0.01
