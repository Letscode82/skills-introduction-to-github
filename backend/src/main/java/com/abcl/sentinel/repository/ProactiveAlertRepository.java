package com.abcl.sentinel.repository;

import com.abcl.sentinel.entity.ProactiveAlert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProactiveAlertRepository extends JpaRepository<ProactiveAlert, UUID> {
    Page<ProactiveAlert> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
