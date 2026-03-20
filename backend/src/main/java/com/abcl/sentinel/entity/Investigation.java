package com.abcl.sentinel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "investigation")
@Getter
@Setter
@NoArgsConstructor
public class Investigation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "case_number", nullable = false, unique = true)
    private String caseNumber;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ModuleType module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private AbgEntity entity;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private InvestigationStatus status;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SeverityLevel priority;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "total_amount_paise")
    private Long totalAmountPaise;

    @Column(name = "progress_pct", nullable = false)
    private Integer progressPct;

    private String findings;
    private String recommendation;

    @Column(name = "closed_at")
    private Instant closedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Column(name = "created_by", nullable = false)
    private String createdBy;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (status == null) status = InvestigationStatus.OPEN;
        if (progressPct == null) progressPct = 0;
        if (createdBy == null) createdBy = "system";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
