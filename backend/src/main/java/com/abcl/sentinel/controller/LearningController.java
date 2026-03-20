package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.AlertDto;
import com.abcl.sentinel.service.AlertService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/learning")
public class LearningController {

    private final AlertService alertService;

    public LearningController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getLearningStats() {
        return ResponseEntity.ok(Map.of(
                "totalAutoDisposed", 342,
                "accuracy", 97.2,
                "overrides", 10,
                "falseNegatives", 0,
                "hoursSaved", 256.1,
                "rulesCalibrated", 16
        ));
    }

    @GetMapping("/auto-disposed")
    public ResponseEntity<Page<AlertDto>> getAutoDisposed(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(alertService.getAutoDisposedAlerts(pageable));
    }

    @PostMapping("/auto-disposed/{id}/approve")
    public ResponseEntity<AlertDto> approveAutoDisposition(@PathVariable UUID id) {
        return ResponseEntity.ok(alertService.approveAutoDisposition(id, "current-user"));
    }

    @PostMapping("/auto-disposed/{id}/override")
    public ResponseEntity<AlertDto> overrideAutoDisposition(@PathVariable UUID id) {
        return ResponseEntity.ok(alertService.overrideAutoDisposition(id, "current-user"));
    }
}
