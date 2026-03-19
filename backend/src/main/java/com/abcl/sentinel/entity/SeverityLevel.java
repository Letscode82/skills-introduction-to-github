package com.abcl.sentinel.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum SeverityLevel {
    CRITICAL("critical"),
    ELEVATED("elevated"),
    MODERATE("moderate");

    private final String value;

    SeverityLevel(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
