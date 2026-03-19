package com.abcl.sentinel.service;

import com.abcl.sentinel.dto.EntityDto;
import com.abcl.sentinel.entity.AbgEntity;
import com.abcl.sentinel.repository.EntityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EntityService {

    private final EntityRepository entityRepository;

    public EntityService(EntityRepository entityRepository) {
        this.entityRepository = entityRepository;
    }

    @Transactional(readOnly = true)
    public List<EntityDto> getAllEntities() {
        return entityRepository.findAll().stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public EntityDto getEntity(UUID id) {
        AbgEntity entity = entityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Entity not found: " + id));
        return toDto(entity);
    }

    private EntityDto toDto(AbgEntity entity) {
        return new EntityDto(
                entity.getId(),
                entity.getCode(),
                entity.getName(),
                entity.getRiskScore(),
                EntityDto.severityFromScore(entity.getRiskScore()),
                entity.getTotalAlerts(),
                entity.getCriticalAlerts(),
                entity.getAutoDisposedCount(),
                entity.getActiveInvestigations() != null ? entity.getActiveInvestigations() : 0
        );
    }
}
