package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.CopilotRequest;
import com.abcl.sentinel.dto.CopilotResponse;
import com.abcl.sentinel.service.CopilotService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/copilot")
public class CopilotController {

    private final CopilotService copilotService;

    public CopilotController(CopilotService copilotService) {
        this.copilotService = copilotService;
    }

    @PostMapping("/generate")
    public ResponseEntity<CopilotResponse> generate(@Valid @RequestBody CopilotRequest request) {
        return ResponseEntity.ok(copilotService.generate(request));
    }

    @PostMapping("/ask")
    public ResponseEntity<CopilotResponse> ask(@RequestBody Map<String, String> body) {
        String question = body.getOrDefault("question", "");
        UUID alertId = body.containsKey("alertId") ? UUID.fromString(body.get("alertId")) : null;
        return ResponseEntity.ok(copilotService.ask(question, alertId));
    }
}
