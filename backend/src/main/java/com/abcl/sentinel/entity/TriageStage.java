package com.abcl.sentinel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "triage_stage")
@Getter
@Setter
@NoArgsConstructor
public class TriageStage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "alert_id", nullable = false)
    private UUID alertId;

    @Column(name = "alert_created_at", nullable = false)
    private Instant alertCreatedAt;

    @Column(name = "stage_number", nullable = false)
    private Integer stageNumber;

    @Column(name = "stage_name", nullable = false)
    private String stageName;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TriageStageStatus status;

    @Column(name = "agent_name")
    private String agentName;

    @Column(name = "confidence")
    private BigDecimal confidence;

    @Column(name = "duration_ms")
    private Integer durationMs;

    @Column(name = "started_at")
    private Instant startedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

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
        if (status == null) status = TriageStageStatus.PENDING;
        if (createdBy == null) createdBy = "system";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
