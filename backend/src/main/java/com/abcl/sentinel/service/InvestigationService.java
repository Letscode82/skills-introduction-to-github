package com.abcl.sentinel.service;

import com.abcl.sentinel.dto.InvestigationActionDto;
import com.abcl.sentinel.dto.InvestigationDto;
import com.abcl.sentinel.entity.Investigation;
import com.abcl.sentinel.entity.InvestigationStatus;
import com.abcl.sentinel.repository.InvestigationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class InvestigationService {

    private final InvestigationRepository investigationRepository;

    public InvestigationService(InvestigationRepository investigationRepository) {
        this.investigationRepository = investigationRepository;
    }

    @Transactional(readOnly = true)
    public Page<InvestigationDto> getInvestigations(InvestigationStatus status, Pageable pageable) {
        Page<Investigation> investigations;
        if (status != null) {
            investigations = investigationRepository.findByStatus(status, pageable);
        } else {
            investigations = investigationRepository.findAll(pageable);
        }
        return investigations.map(this::toDto);
    }

    @Transactional(readOnly = true)
    public InvestigationDto getInvestigation(UUID id) {
        Investigation inv = investigationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Investigation not found: " + id));
        return toDto(inv);
    }

    private InvestigationDto toDto(Investigation inv) {
        return new InvestigationDto(
                inv.getId(),
                inv.getCaseNumber(),
                inv.getTitle(),
                inv.getDescription(),
                inv.getModule().getValue(),
                inv.getEntity().getCode(),
                inv.getEntity().getName(),
                inv.getStatus().getValue(),
                inv.getPriority().getValue(),
                inv.getAssignedTo(),
                inv.getTotalAmountPaise(),
                formatAmount(inv.getTotalAmountPaise()),
                inv.getProgressPct(),
                inv.getFindings(),
                inv.getRecommendation(),
                List.of(),
                inv.getCreatedAt()
        );
    }

    private String formatAmount(Long paise) {
        if (paise == null) return "₹0";
        return "₹" + String.format("%,.2f", paise / 100.0);
    }
}
