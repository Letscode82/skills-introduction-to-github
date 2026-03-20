package com.abcl.sentinel.service;

import com.abcl.sentinel.dto.CopilotRequest;
import com.abcl.sentinel.dto.CopilotResponse;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CopilotService {

    // Spring AI integration will be configured when ANTHROPIC_API_KEY is available
    public CopilotResponse generate(CopilotRequest request) {
        String content = generateContent(request);
        return new CopilotResponse(
                UUID.randomUUID(),
                request.outputType(),
                content,
                0
        );
    }

    public CopilotResponse ask(String question, UUID alertId) {
        String response = "Based on the investigation data for alert " + alertId +
                ", here is the analysis: " + question +
                "\n\n[AI-generated response will be provided when Spring AI is configured with Anthropic API key]";
        return new CopilotResponse(UUID.randomUUID(), "qa_response", response, 0);
    }

    private String generateContent(CopilotRequest request) {
        return switch (request.outputType()) {
            case "memo" -> generateMemo(request);
            case "email" -> generateEmail(request);
            case "block_order" -> generateBlockOrder(request);
            case "agenda" -> generateAgenda(request);
            default -> "Unsupported output type: " + request.outputType();
        };
    }

    private String generateMemo(CopilotRequest request) {
        return """
                INVESTIGATION MEMO
                ==================

                Subject: Fraud Investigation Summary
                Alert/Case Reference: %s

                [AI-generated investigation memo will be provided when Spring AI is configured]

                This memo will include:
                - Executive summary of findings
                - Timeline of suspicious activities
                - Evidence analysis
                - Risk assessment
                - Recommended actions
                """.formatted(request.alertId() != null ? request.alertId() : request.investigationId());
    }

    private String generateEmail(CopilotRequest request) {
        return """
                Subject: Escalation - Fraud Alert Investigation

                Dear Investigation Team,

                [AI-generated escalation email will be provided when Spring AI is configured]

                This email will include case details, evidence summary, and required actions.

                Regards,
                Sentinel AI System
                """;
    }

    private String generateBlockOrder(CopilotRequest request) {
        return """
                SYSTEM BLOCK ORDER
                ==================

                [AI-generated block order will be provided when Spring AI is configured]

                This order will include vendor/entity details and blocking justification.
                """;
    }

    private String generateAgenda(CopilotRequest request) {
        return """
                INVESTIGATION MEETING AGENDA
                ============================

                [AI-generated meeting agenda will be provided when Spring AI is configured]

                Agenda items will cover case review, evidence discussion, and action planning.
                """;
    }
}
