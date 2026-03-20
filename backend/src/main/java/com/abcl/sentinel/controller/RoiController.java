package com.abcl.sentinel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/roi")
public class RoiController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getRoi() {
        return ResponseEntity.ok(Map.of(
                "totalFraudDetected", "₹49.60 Cr",
                "totalRecovery", "₹31.10 Cr",
                "totalPenaltiesAvoided", "₹14.30 Cr",
                "totalHoursBefore", 11120.0,
                "totalHoursAfter", 3100.0,
                "totalHoursSaved", 8020.0,
                "monthlyTrend", List.of(
                        Map.of("month", "Jul 2025", "fraudDetected", "₹4.50 Cr", "recovery", "₹2.80 Cr", "alertsProcessed", 456),
                        Map.of("month", "Aug 2025", "fraudDetected", "₹5.20 Cr", "recovery", "₹3.10 Cr", "alertsProcessed", 489),
                        Map.of("month", "Sep 2025", "fraudDetected", "₹3.80 Cr", "recovery", "₹2.45 Cr", "alertsProcessed", 512),
                        Map.of("month", "Oct 2025", "fraudDetected", "₹6.10 Cr", "recovery", "₹3.90 Cr", "alertsProcessed", 534),
                        Map.of("month", "Nov 2025", "fraudDetected", "₹4.90 Cr", "recovery", "₹3.05 Cr", "alertsProcessed", 498),
                        Map.of("month", "Dec 2025", "fraudDetected", "₹5.70 Cr", "recovery", "₹3.65 Cr", "alertsProcessed", 521),
                        Map.of("month", "Jan 2026", "fraudDetected", "₹6.80 Cr", "recovery", "₹4.20 Cr", "alertsProcessed", 567),
                        Map.of("month", "Feb 2026", "fraudDetected", "₹7.20 Cr", "recovery", "₹4.55 Cr", "alertsProcessed", 589),
                        Map.of("month", "Mar 2026", "fraudDetected", "₹5.40 Cr", "recovery", "₹3.40 Cr", "alertsProcessed", 478)
                )
        ));
    }
}
