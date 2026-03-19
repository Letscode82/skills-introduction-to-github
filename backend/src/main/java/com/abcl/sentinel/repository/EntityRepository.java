package com.abcl.sentinel.repository;

import com.abcl.sentinel.entity.AbgEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntityRepository extends JpaRepository<AbgEntity, UUID> {
    Optional<AbgEntity> findByCode(String code);
}
