package com.abcl.sentinel.dto;

import java.util.UUID;

public record EntityDto(
    UUID id,
    String code,
    String name,
    Integer riskScore,
    String severity,
    Integer totalAlerts,
    Integer criticalAlerts,
    Integer autoDisposedCount,
    Integer activeInvestigations
) {
    public static String severityFromScore(int score) {
        if (score >= 75) return "critical";
        if (score >= 50) return "elevated";
        return "moderate";
    }
}
