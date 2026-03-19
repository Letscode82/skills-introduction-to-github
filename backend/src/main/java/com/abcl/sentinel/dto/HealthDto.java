package com.abcl.sentinel.dto;

import java.util.Map;

public record HealthDto(
    String status,
    String version,
    Map<String, String> modules,
    Map<String, String> services
) {}
