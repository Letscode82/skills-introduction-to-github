package com.abcl.sentinel.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AlertDto(
    UUID id,
    String alertNumber,
    String module,
    String entityCode,
    String entityName,
    String title,
    String description,
    Integer riskScore,
    String severity,
    String status,
    String vendorName,
    String vendorId,
    Long amountPaise,
    String amountFormatted,
    BigDecimal mlConfidence,
    Boolean autoDisposed,
    Instant autoDisposedAt,
    Boolean autoDispositionApproved,
    String assignedTo,
    Instant triageStartedAt,
    Instant triageCompletedAt,
    List<TriageStageDto> triageStages,
    Instant createdAt
) {
    public static String formatAmount(Long paise) {
        if (paise == null) return "₹0";
        return "₹" + String.format("%,.2f", paise / 100.0);
    }
}
