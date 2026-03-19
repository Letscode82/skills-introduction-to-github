package com.abcl.sentinel.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum AlertStatus {
    PENDING("pending"),
    TRIAGING("triaging"),
    TRIAGED("triaged"),
    AUTO_DISPOSED("auto_disposed"),
    ESCALATED("escalated"),
    INVESTIGATING("investigating"),
    CLOSED("closed");

    private final String value;

    AlertStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
