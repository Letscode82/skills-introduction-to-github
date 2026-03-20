package com.abcl.sentinel.dto;

import java.util.List;

public record RoiDto(
    String totalFraudDetected,
    String totalRecovery,
    String totalPenaltiesAvoided,
    Double totalHoursBefore,
    Double totalHoursAfter,
    Double totalHoursSaved,
    List<MonthlyRoiDto> monthlyTrend
) {
    public record MonthlyRoiDto(
        String month,
        String fraudDetected,
        String recovery,
        Integer alertsProcessed,
        Double hoursBefore,
        Double hoursAfter
    ) {}
}
