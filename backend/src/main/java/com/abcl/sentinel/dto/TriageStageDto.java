package com.abcl.sentinel.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TriageStageDto(
    UUID id,
    Integer stageNumber,
    String stageName,
    String status,
    String agentName,
    BigDecimal confidence,
    Integer durationMs,
    Instant startedAt,
    Instant completedAt
) {}
