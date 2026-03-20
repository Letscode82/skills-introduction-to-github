package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.InvestigationDto;
import com.abcl.sentinel.entity.InvestigationStatus;
import com.abcl.sentinel.service.InvestigationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/investigations")
public class InvestigationController {

    private final InvestigationService investigationService;

    public InvestigationController(InvestigationService investigationService) {
        this.investigationService = investigationService;
    }

    @GetMapping
    public ResponseEntity<Page<InvestigationDto>> getInvestigations(
            @RequestParam(required = false) InvestigationStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(investigationService.getInvestigations(status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvestigationDto> getInvestigation(@PathVariable UUID id) {
        return ResponseEntity.ok(investigationService.getInvestigation(id));
    }
}
