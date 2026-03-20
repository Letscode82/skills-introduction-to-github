package com.abcl.sentinel.dto;

import java.time.Instant;
import java.util.UUID;

public record InvestigationActionDto(
    UUID id,
    String actionType,
    String description,
    String actor,
    Instant createdAt
) {}
