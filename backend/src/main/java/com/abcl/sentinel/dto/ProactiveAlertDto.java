package com.abcl.sentinel.dto;

import java.time.Instant;
import java.util.UUID;

public record ProactiveAlertDto(
    UUID id,
    String title,
    String description,
    String module,
    String entityCode,
    String severity,
    Boolean isRead,
    Instant createdAt
) {}
