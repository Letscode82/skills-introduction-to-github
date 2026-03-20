package com.abcl.sentinel.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum InvestigationStatus {
    OPEN("open"),
    UNDER_REVIEW("under_review"),
    ESCALATED("escalated"),
    CLOSED("closed");

    private final String value;

    InvestigationStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
