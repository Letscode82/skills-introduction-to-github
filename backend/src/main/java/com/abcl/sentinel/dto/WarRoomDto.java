package com.abcl.sentinel.dto;

import java.util.List;

public record WarRoomDto(
    Integer alertsToday,
    Integer aiTriagedToday,
    Integer activeCritical,
    Integer activeInvestigations,
    List<ModuleHealthDto> moduleHealth,
    List<AlertDto> liveAlertFeed,
    List<EntityDto> entityRiskPulse
) {
    public record ModuleHealthDto(
        String module,
        Integer totalAlerts,
        Integer criticalCount,
        Integer pendingCount,
        Integer autoDisposedCount,
        Double avgRiskScore
    ) {}
}
