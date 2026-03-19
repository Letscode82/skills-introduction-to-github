package com.abcl.sentinel.repository;

import com.abcl.sentinel.entity.Investigation;
import com.abcl.sentinel.entity.InvestigationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvestigationRepository extends JpaRepository<Investigation, UUID> {
    Page<Investigation> findByStatus(InvestigationStatus status, Pageable pageable);
    Optional<Investigation> findByCaseNumber(String caseNumber);
    long countByStatusNot(InvestigationStatus status);
}
