-- Sentinel AI v5.0 — Seed Data

-- ABG Group Entities
INSERT INTO entity (code, name, risk_score, total_alerts, critical_alerts, auto_disposed_count) VALUES
('ABCL', 'Aditya Birla Capital Ltd', 72, 342, 28, 187),
('ABSLI', 'Aditya Birla Sun Life Insurance', 85, 456, 52, 234),
('ABFL', 'Aditya Birla Finance Ltd', 68, 289, 19, 156),
('ABHFL', 'Aditya Birla Housing Finance Ltd', 45, 178, 8, 102),
('ABHI', 'Aditya Birla Health Insurance', 78, 367, 41, 198),
('ABMF', 'Aditya Birla Mutual Fund', 35, 124, 5, 89),
('ABPE', 'Aditya Birla Private Equity', 52, 198, 12, 112),
('ABCD', 'Aditya Birla Capital Digital', 41, 156, 7, 95),
('ABWM', 'Aditya Birla Wealth Management', 58, 234, 15, 134),
('ABARC', 'Aditya Birla ARC', 63, 267, 22, 145);

-- Sample Detection Rules (subset of 400+)
INSERT INTO detection_rule (code, name, description, module, severity, base_score) VALUES
('P2P-001', 'Split Purchase Order', 'PO split to avoid approval threshold', 'p2p', 'critical', 85),
('P2P-002', 'Vendor Bank Change', 'Vendor bank account changed before payment', 'p2p', 'elevated', 65),
('P2P-003', 'Round Amount Pattern', 'Multiple round-amount invoices from same vendor', 'p2p', 'moderate', 45),
('P2P-004', 'Dormant Vendor Activation', 'Payment to vendor dormant >12 months', 'p2p', 'elevated', 70),
('P2P-005', 'Duplicate Invoice Detection', 'Invoice number/amount matches existing record', 'p2p', 'critical', 90),
('P2P-006', 'Shell Company Indicators', 'Vendor exhibits shell company characteristics', 'p2p', 'critical', 95),
('P2P-007', 'Bid Rigging Pattern', 'Suspicious bidding patterns among related vendors', 'p2p', 'critical', 88),
('TNE-001', 'Weekend Hotel Booking', 'Hotel booking extends over weekend without business justification', 'tne', 'moderate', 40),
('TNE-002', 'Ghost Employee Travel', 'Travel claim for employee on leave/terminated', 'tne', 'critical', 92),
('TNE-003', 'Duplicate Expense Claim', 'Same expense submitted multiple times', 'tne', 'elevated', 75),
('TNE-004', 'Out-of-Policy Spending', 'Expense exceeds policy limits without approval', 'tne', 'elevated', 60),
('TNE-005', 'Benford Law Anomaly', 'Expense amounts fail Benford distribution test', 'tne', 'elevated', 70),
('LN-001', 'Evergreening Detection', 'Loan renewed to avoid NPA classification', 'loans', 'critical', 88),
('LN-002', 'Related Party Lending', 'Loan to entity with undisclosed relationship', 'loans', 'critical', 92),
('LN-003', 'Valuation Inflation', 'Collateral valuation significantly above market', 'loans', 'elevated', 72),
('LN-004', 'Income Fabrication', 'Submitted income documents show anomalies', 'loans', 'critical', 85),
('INS-001', 'Staged Accident Pattern', 'Claim characteristics match staged accident profile', 'insurance', 'critical', 90),
('INS-002', 'Provider Billing Anomaly', 'Healthcare provider billing patterns deviate from peers', 'insurance', 'elevated', 68),
('INS-003', 'Policy Stacking', 'Multiple policies taken shortly before large claim', 'insurance', 'critical', 87),
('INS-004', 'Document Tampering', 'OCR analysis detects document modification', 'insurance', 'critical', 93);

-- Sample ROI Metrics
INSERT INTO roi_metric (month, fraud_detected_paise, recovery_paise, penalties_avoided_paise, reviewer_hours_before, reviewer_hours_after, alerts_processed) VALUES
('2025-07-01', 450000000, 280000000, 120000000, 1200, 340, 456),
('2025-08-01', 520000000, 310000000, 95000000, 1150, 310, 489),
('2025-09-01', 380000000, 245000000, 150000000, 1300, 360, 512),
('2025-10-01', 610000000, 390000000, 180000000, 1250, 320, 534),
('2025-11-01', 490000000, 305000000, 135000000, 1180, 290, 498),
('2025-12-01', 570000000, 365000000, 165000000, 1220, 305, 521),
('2026-01-01', 680000000, 420000000, 200000000, 1280, 330, 567),
('2026-02-01', 720000000, 455000000, 210000000, 1350, 345, 589),
('2026-03-01', 540000000, 340000000, 175000000, 1190, 300, 478);

-- Sample Learning Stats
INSERT INTO learning_stat (date, total_auto_disposed, accuracy_pct, overrides, false_negatives, hours_saved, rules_calibrated) VALUES
('2026-03-13', 45, 97.20, 2, 0, 34.5, 3),
('2026-03-14', 52, 97.50, 1, 0, 38.2, 1),
('2026-03-15', 38, 96.80, 3, 0, 28.7, 2),
('2026-03-16', 61, 97.80, 1, 0, 45.1, 4),
('2026-03-17', 49, 97.10, 2, 0, 36.8, 2),
('2026-03-18', 55, 97.40, 1, 0, 41.3, 3),
('2026-03-19', 42, 97.60, 0, 0, 31.5, 1);
