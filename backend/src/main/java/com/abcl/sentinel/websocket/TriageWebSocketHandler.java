package com.abcl.sentinel.websocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class TriageWebSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;

    public TriageWebSocketHandler(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendTriageUpdate(UUID alertId, int stageNumber, String stageName, String status) {
        messagingTemplate.convertAndSend("/topic/triage/" + alertId, Map.of(
                "alertId", alertId.toString(),
                "stageNumber", stageNumber,
                "stageName", stageName,
                "status", status,
                "timestamp", java.time.Instant.now().toString()
        ));
    }

    public void sendAlertUpdate(UUID alertId, String status, int riskScore) {
        messagingTemplate.convertAndSend("/topic/alerts", Map.of(
                "alertId", alertId.toString(),
                "status", status,
                "riskScore", riskScore,
                "timestamp", java.time.Instant.now().toString()
        ));
    }
}
