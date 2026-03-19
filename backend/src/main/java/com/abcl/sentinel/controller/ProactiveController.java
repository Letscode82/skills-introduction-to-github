package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.ProactiveAlertDto;
import com.abcl.sentinel.entity.ProactiveAlert;
import com.abcl.sentinel.repository.ProactiveAlertRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/proactive")
public class ProactiveController {

    private final ProactiveAlertRepository proactiveAlertRepository;

    public ProactiveController(ProactiveAlertRepository proactiveAlertRepository) {
        this.proactiveAlertRepository = proactiveAlertRepository;
    }

    @GetMapping
    public ResponseEntity<Page<ProactiveAlertDto>> getProactiveAlerts(
            @PageableDefault(size = 20) Pageable pageable) {
        Page<ProactiveAlertDto> dtos = proactiveAlertRepository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toDto);
        return ResponseEntity.ok(dtos);
    }

    private ProactiveAlertDto toDto(ProactiveAlert pa) {
        return new ProactiveAlertDto(
                pa.getId(),
                pa.getTitle(),
                pa.getDescription(),
                pa.getModule() != null ? pa.getModule().getValue() : null,
                pa.getEntity() != null ? pa.getEntity().getCode() : null,
                pa.getSeverity().getValue(),
                pa.getIsRead(),
                pa.getCreatedAt()
        );
    }
}
