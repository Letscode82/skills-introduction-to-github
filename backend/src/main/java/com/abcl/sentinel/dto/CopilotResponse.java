package com.abcl.sentinel.dto;

import java.util.UUID;

public record CopilotResponse(
    UUID id,
    String outputType,
    String content,
    Integer tokensUsed
) {}
