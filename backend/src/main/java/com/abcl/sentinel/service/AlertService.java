package com.abcl.sentinel.service;

import com.abcl.sentinel.dto.*;
import com.abcl.sentinel.entity.*;
import com.abcl.sentinel.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final TriageStageRepository triageStageRepository;

    public AlertService(AlertRepository alertRepository, TriageStageRepository triageStageRepository) {
        this.alertRepository = alertRepository;
        this.triageStageRepository = triageStageRepository;
    }

    @Transactional(readOnly = true)
    public Page<AlertDto> getAlerts(ModuleType module, SeverityLevel severity, Pageable pageable) {
        Page<Alert> alerts;
        if (module != null && severity != null) {
            alerts = alertRepository.findByModuleAndSeverity(module, severity, pageable);
        } else if (module != null) {
            alerts = alertRepository.findByModule(module, pageable);
        } else {
            alerts = alertRepository.findAll(pageable);
        }
        return alerts.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public AlertDto getAlert(UUID id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        List<TriageStage> stages = triageStageRepository.findByAlertIdOrderByStageNumberAsc(id);
        return toDto(alert, stages);
    }

    @Transactional(readOnly = true)
    public Page<AlertDto> getAutoDisposedAlerts(Pageable pageable) {
        return alertRepository.findPendingAutoDisposed(pageable).map(this::toDto);
    }

    @Transactional
    public AlertDto approveAutoDisposition(UUID id, String approvedBy) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        alert.setAutoDispositionApproved(true);
        alert.setAutoDispositionApprovedBy(approvedBy);
        alert.setAutoDispositionApprovedAt(java.time.Instant.now());
        alert.setStatus(AlertStatus.CLOSED);
        return toDto(alertRepository.save(alert));
    }

    @Transactional
    public AlertDto overrideAutoDisposition(UUID id, String overriddenBy) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found: " + id));
        alert.setAutoDispositionApproved(false);
        alert.setAutoDispositionApprovedBy(overriddenBy);
        alert.setAutoDispositionApprovedAt(java.time.Instant.now());
        alert.setAutoDisposed(false);
        alert.setStatus(AlertStatus.PENDING);
        return toDto(alertRepository.save(alert));
    }

    private AlertDto toDto(Alert alert) {
        return toDto(alert, List.of());
    }

    private AlertDto toDto(Alert alert, List<TriageStage> stages) {
        return new AlertDto(
                alert.getId(),
                alert.getAlertNumber(),
                alert.getModule().getValue(),
                alert.getEntity().getCode(),
                alert.getEntity().getName(),
                alert.getTitle(),
                alert.getDescription(),
                alert.getRiskScore(),
                alert.getSeverity().getValue(),
                alert.getStatus().getValue(),
                alert.getVendorName(),
                alert.getVendorId(),
                alert.getAmountPaise(),
                AlertDto.formatAmount(alert.getAmountPaise()),
                alert.getMlConfidence(),
                alert.getAutoDisposed(),
                alert.getAutoDisposedAt(),
                alert.getAutoDispositionApproved(),
                alert.getAssignedTo(),
                alert.getTriageStartedAt(),
                alert.getTriageCompletedAt(),
                stages.stream().map(this::toStageDto).toList(),
                alert.getCreatedAt()
        );
    }

    private TriageStageDto toStageDto(TriageStage stage) {
        return new TriageStageDto(
                stage.getId(),
                stage.getStageNumber(),
                stage.getStageName(),
                stage.getStatus().getValue(),
                stage.getAgentName(),
                stage.getConfidence(),
                stage.getDurationMs(),
                stage.getStartedAt(),
                stage.getCompletedAt()
        );
    }
}
