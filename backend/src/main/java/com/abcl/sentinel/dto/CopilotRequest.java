package com.abcl.sentinel.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

public record CopilotRequest(
    UUID alertId,
    UUID investigationId,
    @NotBlank String outputType,
    String prompt,
    String context
) {}
