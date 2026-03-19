package com.abcl.sentinel.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TriageStageStatus {
    PENDING("pending"),
    RUNNING("running"),
    COMPLETED("completed"),
    FAILED("failed"),
    SKIPPED("skipped");

    private final String value;

    TriageStageStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
