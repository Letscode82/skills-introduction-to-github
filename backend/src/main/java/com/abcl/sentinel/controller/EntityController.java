package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.EntityDto;
import com.abcl.sentinel.service.EntityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/entities")
public class EntityController {

    private final EntityService entityService;

    public EntityController(EntityService entityService) {
        this.entityService = entityService;
    }

    @GetMapping
    public ResponseEntity<List<EntityDto>> getEntities() {
        return ResponseEntity.ok(entityService.getAllEntities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityDto> getEntity(@PathVariable UUID id) {
        return ResponseEntity.ok(entityService.getEntity(id));
    }
}
