package com.abcl.sentinel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "entity")
@Getter
@Setter
@NoArgsConstructor
public class AbgEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "risk_score", nullable = false)
    private Integer riskScore;

    @Column(name = "total_alerts", nullable = false)
    private Integer totalAlerts;

    @Column(name = "critical_alerts", nullable = false)
    private Integer criticalAlerts;

    @Column(name = "auto_disposed_count", nullable = false)
    private Integer autoDisposedCount;

    @Column(name = "active_investigations")
    private Integer activeInvestigations;

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
        if (createdBy == null) createdBy = "system";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
