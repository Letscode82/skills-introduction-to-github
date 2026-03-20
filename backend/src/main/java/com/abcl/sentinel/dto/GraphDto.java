package com.abcl.sentinel.dto;

import java.util.List;

public record GraphDto(
    List<GraphNodeDto> nodes,
    List<GraphEdgeDto> edges
) {
    public record GraphNodeDto(
        String id,
        String type,
        String label,
        Object properties
    ) {}

    public record GraphEdgeDto(
        String source,
        String target,
        String type,
        String label,
        Double weight
    ) {}
}
