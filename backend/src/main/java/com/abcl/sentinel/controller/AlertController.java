package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.AlertDto;
import com.abcl.sentinel.dto.GraphDto;
import com.abcl.sentinel.entity.ModuleType;
import com.abcl.sentinel.entity.SeverityLevel;
import com.abcl.sentinel.service.AlertService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<Page<AlertDto>> getAlerts(
            @RequestParam(required = false) ModuleType module,
            @RequestParam(required = false) SeverityLevel severity,
            @PageableDefault(size = 20, sort = "riskScore") Pageable pageable) {
        return ResponseEntity.ok(alertService.getAlerts(module, severity, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertDto> getAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(alertService.getAlert(id));
    }

    @GetMapping("/{id}/emails")
    public ResponseEntity<List<Object>> getAlertEmails(@PathVariable UUID id) {
        // Email trail integration via Microsoft Graph API
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}/calendar")
    public ResponseEntity<List<Object>> getAlertCalendar(@PathVariable UUID id) {
        // Calendar correlation for T&E module
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{id}/graph")
    public ResponseEntity<GraphDto> getAlertGraph(@PathVariable UUID id) {
        // Graph data computed by backend, rendered by D3.js on frontend
        return ResponseEntity.ok(new GraphDto(List.of(), List.of()));
    }
}
