package com.abcl.sentinel.repository;

import com.abcl.sentinel.entity.Alert;
import com.abcl.sentinel.entity.AlertStatus;
import com.abcl.sentinel.entity.ModuleType;
import com.abcl.sentinel.entity.SeverityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {

    Page<Alert> findByModule(ModuleType module, Pageable pageable);

    Page<Alert> findByModuleAndSeverity(ModuleType module, SeverityLevel severity, Pageable pageable);

    @Query("SELECT a FROM Alert a WHERE a.module = :module AND a.status IN :statuses ORDER BY a.riskScore DESC")
    List<Alert> findByModuleAndStatusIn(@Param("module") ModuleType module, @Param("statuses") List<AlertStatus> statuses);

    @Query("SELECT a FROM Alert a WHERE a.autoDisposed = true AND a.autoDispositionApproved IS NULL ORDER BY a.createdAt DESC")
    Page<Alert> findPendingAutoDisposed(Pageable pageable);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.autoDisposed = true")
    long countAutoDisposed();

    Optional<Alert> findByAlertNumber(String alertNumber);

    @Query("SELECT a FROM Alert a ORDER BY a.createdAt DESC")
    List<Alert> findRecentAlerts(Pageable pageable);
}
