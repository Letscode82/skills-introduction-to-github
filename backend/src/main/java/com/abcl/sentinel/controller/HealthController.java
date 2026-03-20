package com.abcl.sentinel.controller;

import com.abcl.sentinel.dto.HealthDto;
import com.abcl.sentinel.dto.ModuleDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<HealthDto> health() {
        return ResponseEntity.ok(new HealthDto(
                "UP",
                "5.0.0",
                Map.of(
                        "p2p", "operational",
                        "tne", "operational",
                        "loans", "operational",
                        "insurance", "operational"
                ),
                Map.of(
                        "database", "connected",
                        "ml_services", "available",
                        "microsoft_graph", "connected"
                )
        ));
    }

    @GetMapping("/modules")
    public ResponseEntity<List<ModuleDto>> modules() {
        return ResponseEntity.ok(List.of(
                new ModuleDto("p2p", "P2P Procurement", "Procurement-to-Pay fraud detection across vendor management, purchase orders, and invoice processing",
                        120, new String[]{"Data Ingestion", "Rule Engine", "Vendor Profiling", "TPRM Check", "COI Analysis", "Email Intelligence", "Graph Analysis", "Statistical Analysis", "Risk Scoring", "Disposition"}),
                new ModuleDto("tne", "Travel & Expense", "Travel and expense claim fraud detection including ghost employees, duplicate claims, and policy violations",
                        95, new String[]{"Data Ingestion", "Rule Engine", "Employee Profiling", "Calendar Correlation", "Benford Analysis", "Email Intelligence", "Receipt OCR", "Statistical Analysis", "Risk Scoring", "Disposition"}),
                new ModuleDto("loans", "Loans & Advances", "Loan fraud detection covering evergreening, related-party lending, valuation inflation, and income fabrication",
                        105, new String[]{"Data Ingestion", "Rule Engine", "Borrower Profiling", "Income Verification", "Collateral Analysis", "CIBIL Check", "Graph Analysis", "Statistical Analysis", "Risk Scoring", "Disposition"}),
                new ModuleDto("insurance", "Insurance Claims", "Insurance claim fraud detection for staged accidents, provider anomalies, policy stacking, and document tampering",
                        85, new String[]{"Data Ingestion", "Rule Engine", "Claimant Profiling", "Provider Analysis", "Document OCR", "Policy Stacking Check", "Graph Analysis", "Statistical Analysis", "Risk Scoring", "Disposition"})
        ));
    }
}
