package com.abcl.sentinel.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record InvestigationDto(
    UUID id,
    String caseNumber,
    String title,
    String description,
    String module,
    String entityCode,
    String entityName,
    String status,
    String priority,
    String assignedTo,
    Long totalAmountPaise,
    String totalAmountFormatted,
    Integer progressPct,
    String findings,
    String recommendation,
    List<InvestigationActionDto> actions,
    Instant createdAt
) {}
