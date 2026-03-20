package com.abcl.sentinel.dto;

import java.util.List;

public record LearningDto(
    Integer totalAutoDisposed,
    Double accuracy,
    Integer overrides,
    Integer falseNegatives,
    Double hoursSaved,
    Integer rulesCalibrated,
    List<AccuracyTrendDto> accuracyTrend,
    List<RuleCalibrationDto> ruleCalibrations
) {
    public record AccuracyTrendDto(String date, Double accuracy) {}
    public record RuleCalibrationDto(
        String ruleCode,
        String ruleName,
        Integer oldScore,
        Integer newScore,
        String reason,
        String calibratedAt
    ) {}
}
