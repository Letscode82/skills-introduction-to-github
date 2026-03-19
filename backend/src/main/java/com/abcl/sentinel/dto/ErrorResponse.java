package com.abcl.sentinel.dto;

public record ErrorResponse(
    String error,
    String code,
    Object details
) {}
