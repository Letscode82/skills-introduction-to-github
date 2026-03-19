package com.abcl.sentinel.dto;

public record ModuleDto(
    String code,
    String name,
    String description,
    Integer totalRules,
    String[] triageStages
) {}
