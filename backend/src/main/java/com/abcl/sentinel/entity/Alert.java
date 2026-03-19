package com.abcl.sentinel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alert")
@Getter
@Setter
@NoArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "alert_number", nullable = false, unique = true)
    private String alertNumber;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ModuleType module;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entity_id", nullable = false)
    private AbgEntity entity;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SeverityLevel severity;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(name = "vendor_id")
    private String vendorId;

    @Column(name = "amount_paise")
    private Long amountPaise;

    @Column(name = "ml_confidence")
    private BigDecimal mlConfidence;

    @Column(name = "auto_disposed")
    private Boolean autoDisposed;

    @Column(name = "auto_disposed_at")
    private Instant autoDisposedAt;

    @Column(name = "auto_disposition_approved")
    private Boolean autoDispositionApproved;

    @Column(name = "auto_disposition_approved_by")
    private String autoDispositionApprovedBy;

    @Column(name = "auto_disposition_approved_at")
    private Instant autoDispositionApprovedAt;

    @Column(name = "assigned_to")
    private String assignedTo;

    @Column(name = "triage_started_at")
    private Instant triageStartedAt;

    @Column(name = "triage_completed_at")
    private Instant triageCompletedAt;

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
        if (status == null) status = AlertStatus.PENDING;
        if (autoDisposed == null) autoDisposed = false;
        if (createdBy == null) createdBy = "system";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
