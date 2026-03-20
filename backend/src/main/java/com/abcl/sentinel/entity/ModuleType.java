package com.abcl.sentinel.entity;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ModuleType {
    P2P("p2p"),
    TNE("tne"),
    LOANS("loans"),
    INSURANCE("insurance");

    private final String value;

    ModuleType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
