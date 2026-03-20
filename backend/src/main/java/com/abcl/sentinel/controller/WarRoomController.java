package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.EntityDto;
import com.abcl.sentinel.service.EntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/war-room")
public class WarRoomController {

    private final EntityService entityService;

    public WarRoomController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getWarRoom() {
        List<EntityDto> entities = entityService.getAllEntities();
        return ResponseEntity.ok(Map.of(
                "alertsToday", 47,
                "aiTriagedToday", 43,
                "activeCritical", 12,
                "activeInvestigations", 8,
                "entityRiskPulse", entities
        ));
    }
}
