-- Sentinel AI v5.0 — Initial Schema
-- PostgreSQL 16 + pgvector + TimescaleDB

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE module_type AS ENUM ('p2p', 'tne', 'loans', 'insurance');
CREATE TYPE severity_level AS ENUM ('critical', 'elevated', 'moderate');
CREATE TYPE alert_status AS ENUM ('pending', 'triaging', 'triaged', 'auto_disposed', 'escalated', 'investigating', 'closed');
CREATE TYPE investigation_status AS ENUM ('open', 'under_review', 'escalated', 'closed');
CREATE TYPE triage_stage_status AS ENUM ('pending', 'running', 'completed', 'failed', 'skipped');
CREATE TYPE entity_code AS ENUM ('ABCL', 'ABSLI', 'ABFL', 'ABHFL', 'ABHI', 'ABMF', 'ABPE', 'ABCD', 'ABWM', 'ABARC');
CREATE TYPE copilot_output_type AS ENUM ('memo', 'email', 'block_order', 'agenda', 'qa_response');
CREATE TYPE graph_node_type AS ENUM ('vendor', 'director', 'employee', 'entity', 'shell', 'bank', 'regulator', 'system');

-- ============================================================
-- CORE TABLES
-- ============================================================

-- ABG Group Entities
CREATE TABLE entity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code entity_code NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    total_alerts INTEGER NOT NULL DEFAULT 0,
    critical_alerts INTEGER NOT NULL DEFAULT 0,
    auto_disposed_count INTEGER NOT NULL DEFAULT 0,
    active_investigations INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Detection Rules
CREATE TABLE detection_rule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module module_type NOT NULL,
    severity severity_level NOT NULL DEFAULT 'moderate',
    base_score INTEGER NOT NULL DEFAULT 50 CHECK (base_score BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    calibrated_score INTEGER CHECK (calibrated_score BETWEEN 0 AND 100),
    calibration_reason TEXT,
    calibrated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Alerts (partitioned monthly)
CREATE TABLE alert (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    alert_number VARCHAR(20) NOT NULL UNIQUE,
    module module_type NOT NULL,
    entity_id UUID NOT NULL REFERENCES entity(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    risk_score INTEGER NOT NULL DEFAULT 0 CHECK (risk_score BETWEEN 0 AND 100),
    severity severity_level NOT NULL DEFAULT 'moderate',
    status alert_status NOT NULL DEFAULT 'pending',
    vendor_name VARCHAR(255),
    vendor_id VARCHAR(100),
    amount_paise BIGINT DEFAULT 0,
    ml_confidence DECIMAL(5,4),
    auto_disposed BOOLEAN NOT NULL DEFAULT FALSE,
    auto_disposed_at TIMESTAMPTZ,
    auto_disposition_approved BOOLEAN,
    auto_disposition_approved_by VARCHAR(255),
    auto_disposition_approved_at TIMESTAMPTZ,
    assigned_to VARCHAR(255),
    triage_started_at TIMESTAMPTZ,
    triage_completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create monthly partitions for 2024-2026
CREATE TABLE alert_2024_q1 PARTITION OF alert FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');
CREATE TABLE alert_2024_q2 PARTITION OF alert FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');
CREATE TABLE alert_2024_q3 PARTITION OF alert FOR VALUES FROM ('2024-07-01') TO ('2024-10-01');
CREATE TABLE alert_2024_q4 PARTITION OF alert FOR VALUES FROM ('2024-10-01') TO ('2025-01-01');
CREATE TABLE alert_2025_q1 PARTITION OF alert FOR VALUES FROM ('2025-01-01') TO ('2025-04-01');
CREATE TABLE alert_2025_q2 PARTITION OF alert FOR VALUES FROM ('2025-04-01') TO ('2025-07-01');
CREATE TABLE alert_2025_q3 PARTITION OF alert FOR VALUES FROM ('2025-07-01') TO ('2025-10-01');
CREATE TABLE alert_2025_q4 PARTITION OF alert FOR VALUES FROM ('2025-10-01') TO ('2026-01-01');
CREATE TABLE alert_2026_q1 PARTITION OF alert FOR VALUES FROM ('2026-01-01') TO ('2026-04-01');
CREATE TABLE alert_2026_q2 PARTITION OF alert FOR VALUES FROM ('2026-04-01') TO ('2026-07-01');

-- Alert Flags (rule violations per alert)
CREATE TABLE alert_flag (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    rule_id UUID NOT NULL REFERENCES detection_rule(id),
    flag_code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    score_contribution INTEGER NOT NULL DEFAULT 0,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

-- Triage Pipeline Stages
CREATE TABLE triage_stage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    stage_number INTEGER NOT NULL CHECK (stage_number BETWEEN 1 AND 10),
    stage_name VARCHAR(100) NOT NULL,
    status triage_stage_status NOT NULL DEFAULT 'pending',
    agent_name VARCHAR(100),
    input_context JSONB DEFAULT '{}',
    output_result JSONB DEFAULT '{}',
    confidence DECIMAL(5,4),
    duration_ms INTEGER,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at),
    UNIQUE (alert_id, stage_number)
);

-- Transactions (partitioned monthly)
CREATE TABLE transaction (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    alert_id UUID,
    alert_created_at TIMESTAMPTZ,
    entity_id UUID NOT NULL REFERENCES entity(id),
    module module_type NOT NULL,
    transaction_ref VARCHAR(100),
    vendor_name VARCHAR(255),
    vendor_id VARCHAR(100),
    amount_paise BIGINT NOT NULL DEFAULT 0,
    description TEXT,
    transaction_date TIMESTAMPTZ NOT NULL,
    category VARCHAR(100),
    is_flagged BOOLEAN NOT NULL DEFAULT FALSE,
    flag_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE transaction_2024_h1 PARTITION OF transaction FOR VALUES FROM ('2024-01-01') TO ('2024-07-01');
CREATE TABLE transaction_2024_h2 PARTITION OF transaction FOR VALUES FROM ('2024-07-01') TO ('2025-01-01');
CREATE TABLE transaction_2025_h1 PARTITION OF transaction FOR VALUES FROM ('2025-01-01') TO ('2025-07-01');
CREATE TABLE transaction_2025_h2 PARTITION OF transaction FOR VALUES FROM ('2025-07-01') TO ('2026-01-01');
CREATE TABLE transaction_2026_h1 PARTITION OF transaction FOR VALUES FROM ('2026-01-01') TO ('2026-07-01');

-- TPRM (Third-Party Risk Management) Checks
CREATE TABLE tprm_check (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    vendor_id VARCHAR(100),
    risk_rating VARCHAR(50),
    mca_status VARCHAR(50),
    gst_status VARCHAR(50),
    epfo_registered BOOLEAN,
    incorporation_date DATE,
    director_overlap BOOLEAN DEFAULT FALSE,
    shell_company_risk BOOLEAN DEFAULT FALSE,
    pep_match BOOLEAN DEFAULT FALSE,
    sanctions_match BOOLEAN DEFAULT FALSE,
    adverse_media_count INTEGER DEFAULT 0,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

-- COI (Conflict of Interest) Analysis
CREATE TABLE coi_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    employee_name VARCHAR(255),
    employee_id VARCHAR(100),
    relationship_type VARCHAR(100) NOT NULL,
    related_party_name VARCHAR(255) NOT NULL,
    related_party_role VARCHAR(255),
    evidence TEXT,
    risk_level severity_level NOT NULL DEFAULT 'moderate',
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

-- Email Trail (from Microsoft Graph API)
CREATE TABLE email_trail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    message_id VARCHAR(500),
    subject VARCHAR(500) NOT NULL,
    sender VARCHAR(255) NOT NULL,
    recipients TEXT[] NOT NULL DEFAULT '{}',
    sent_at TIMESTAMPTZ NOT NULL,
    snippet TEXT,
    sentiment VARCHAR(50),
    has_attachments BOOLEAN DEFAULT FALSE,
    attachment_names TEXT[] DEFAULT '{}',
    flags TEXT[] DEFAULT '{}',
    relevance_score DECIMAL(5,4),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

-- Calendar Correlation (T&E module)
CREATE TABLE calendar_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    event_subject VARCHAR(500),
    organizer VARCHAR(255),
    attendees TEXT[] DEFAULT '{}',
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location VARCHAR(500),
    is_travel_related BOOLEAN DEFAULT FALSE,
    correlation_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

-- Evidence Network Graph
CREATE TABLE graph_node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    node_id VARCHAR(100) NOT NULL,
    node_type graph_node_type NOT NULL,
    label VARCHAR(255) NOT NULL,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

CREATE TABLE graph_edge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL,
    alert_created_at TIMESTAMPTZ NOT NULL,
    source_node_id VARCHAR(100) NOT NULL,
    target_node_id VARCHAR(100) NOT NULL,
    edge_type VARCHAR(100) NOT NULL,
    label VARCHAR(255),
    weight DECIMAL(5,2) DEFAULT 1.0,
    properties JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system',
    FOREIGN KEY (alert_id, alert_created_at) REFERENCES alert(id, created_at)
);

-- Investigations
CREATE TABLE investigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_number VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    module module_type NOT NULL,
    entity_id UUID NOT NULL REFERENCES entity(id),
    status investigation_status NOT NULL DEFAULT 'open',
    priority severity_level NOT NULL DEFAULT 'moderate',
    assigned_to VARCHAR(255),
    alert_ids UUID[] DEFAULT '{}',
    total_amount_paise BIGINT DEFAULT 0,
    progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
    findings TEXT,
    recommendation TEXT,
    closed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Investigation Actions / Timeline
CREATE TABLE investigation_action (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES investigation(id),
    action_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    actor VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Proactive AI Alerts
CREATE TABLE proactive_alert (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    module module_type,
    entity_id UUID REFERENCES entity(id),
    severity severity_level NOT NULL DEFAULT 'moderate',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Copilot Outputs
CREATE TABLE copilot_output (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID,
    investigation_id UUID REFERENCES investigation(id),
    output_type copilot_output_type NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    context_used JSONB DEFAULT '{}',
    model_version VARCHAR(100),
    tokens_used INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Event Table for LISTEN/NOTIFY pattern
CREATE TABLE event (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}',
    processed BOOLEAN NOT NULL DEFAULT FALSE,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

CREATE TABLE event_2026_03 PARTITION OF event FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');
CREATE TABLE event_2026_04 PARTITION OF event FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');

-- Learning Engine Stats
CREATE TABLE learning_stat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    total_auto_disposed INTEGER NOT NULL DEFAULT 0,
    accuracy_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
    overrides INTEGER NOT NULL DEFAULT 0,
    false_negatives INTEGER NOT NULL DEFAULT 0,
    hours_saved DECIMAL(8,2) NOT NULL DEFAULT 0,
    rules_calibrated INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- ROI Metrics
CREATE TABLE roi_metric (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    month DATE NOT NULL,
    fraud_detected_paise BIGINT NOT NULL DEFAULT 0,
    recovery_paise BIGINT NOT NULL DEFAULT 0,
    penalties_avoided_paise BIGINT NOT NULL DEFAULT 0,
    reviewer_hours_before DECIMAL(8,2) DEFAULT 0,
    reviewer_hours_after DECIMAL(8,2) DEFAULT 0,
    alerts_processed INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- Users
CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'reviewer',
    entity_id UUID REFERENCES entity(id),
    azure_ad_oid VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL DEFAULT 'system'
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_alert_module ON alert(module);
CREATE INDEX idx_alert_entity ON alert(entity_id);
CREATE INDEX idx_alert_status ON alert(status);
CREATE INDEX idx_alert_severity ON alert(severity);
CREATE INDEX idx_alert_risk_score ON alert(risk_score DESC);
CREATE INDEX idx_alert_auto_disposed ON alert(auto_disposed) WHERE auto_disposed = TRUE;

CREATE INDEX idx_alert_flag_alert ON alert_flag(alert_id);
CREATE INDEX idx_triage_stage_alert ON triage_stage(alert_id);
CREATE INDEX idx_transaction_alert ON transaction(alert_id);
CREATE INDEX idx_transaction_entity ON transaction(entity_id);
CREATE INDEX idx_tprm_alert ON tprm_check(alert_id);
CREATE INDEX idx_coi_alert ON coi_analysis(alert_id);
CREATE INDEX idx_email_alert ON email_trail(alert_id);
CREATE INDEX idx_calendar_alert ON calendar_event(alert_id);
CREATE INDEX idx_graph_node_alert ON graph_node(alert_id);
CREATE INDEX idx_graph_edge_alert ON graph_edge(alert_id);
CREATE INDEX idx_investigation_status ON investigation(status);
CREATE INDEX idx_investigation_entity ON investigation(entity_id);
CREATE INDEX idx_proactive_severity ON proactive_alert(severity);
CREATE INDEX idx_event_type ON event(event_type);
CREATE INDEX idx_event_processed ON event(processed) WHERE processed = FALSE;

-- ============================================================
-- MATERIALIZED VIEWS (for dashboard queries < 100ms)
-- ============================================================

CREATE MATERIALIZED VIEW mv_module_summary AS
SELECT
    module,
    COUNT(*) AS total_alerts,
    COUNT(*) FILTER (WHERE severity = 'critical') AS critical_count,
    COUNT(*) FILTER (WHERE severity = 'elevated') AS elevated_count,
    COUNT(*) FILTER (WHERE severity = 'moderate') AS moderate_count,
    COUNT(*) FILTER (WHERE status = 'pending') AS pending_count,
    COUNT(*) FILTER (WHERE auto_disposed = TRUE) AS auto_disposed_count,
    AVG(risk_score) AS avg_risk_score,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today_count
FROM alert
GROUP BY module;

CREATE UNIQUE INDEX idx_mv_module_summary ON mv_module_summary(module);

CREATE MATERIALIZED VIEW mv_entity_risk AS
SELECT
    e.id,
    e.code,
    e.name,
    COALESCE(a.total, 0) AS total_alerts,
    COALESCE(a.critical, 0) AS critical_alerts,
    COALESCE(a.auto_disposed, 0) AS auto_disposed_count,
    COALESCE(a.avg_score, 0) AS avg_risk_score,
    COALESCE(inv.active, 0) AS active_investigations
FROM entity e
LEFT JOIN LATERAL (
    SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE severity = 'critical') AS critical,
        COUNT(*) FILTER (WHERE auto_disposed = TRUE) AS auto_disposed,
        AVG(risk_score) AS avg_score
    FROM alert WHERE entity_id = e.id
) a ON TRUE
LEFT JOIN LATERAL (
    SELECT COUNT(*) AS active
    FROM investigation WHERE entity_id = e.id AND status != 'closed'
) inv ON TRUE;

CREATE UNIQUE INDEX idx_mv_entity_risk ON mv_entity_risk(id);

CREATE MATERIALIZED VIEW mv_war_room AS
SELECT
    (SELECT COUNT(*) FROM alert WHERE created_at >= CURRENT_DATE) AS alerts_today,
    (SELECT COUNT(*) FROM alert WHERE status IN ('triaging', 'triaged') AND created_at >= CURRENT_DATE) AS ai_triaged_today,
    (SELECT COUNT(*) FROM alert WHERE severity = 'critical' AND status NOT IN ('closed', 'auto_disposed')) AS active_critical,
    (SELECT COUNT(*) FROM investigation WHERE status != 'closed') AS active_investigations;

CREATE MATERIALIZED VIEW mv_roi_summary AS
SELECT
    SUM(fraud_detected_paise) AS total_fraud_detected_paise,
    SUM(recovery_paise) AS total_recovery_paise,
    SUM(penalties_avoided_paise) AS total_penalties_avoided_paise,
    SUM(reviewer_hours_before) AS total_hours_before,
    SUM(reviewer_hours_after) AS total_hours_after,
    SUM(reviewer_hours_before - reviewer_hours_after) AS total_hours_saved
FROM roi_metric;

-- ============================================================
-- NOTIFY TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION notify_alert_change() RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('alert_changes', json_build_object(
        'id', NEW.id,
        'alert_number', NEW.alert_number,
        'module', NEW.module,
        'status', NEW.status,
        'risk_score', NEW.risk_score,
        'severity', NEW.severity
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_triage_update() RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('triage_updates', json_build_object(
        'alert_id', NEW.alert_id,
        'stage_number', NEW.stage_number,
        'stage_name', NEW.stage_name,
        'status', NEW.status
    )::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: Triggers on partitioned tables require per-partition triggers in PG < 17
-- For PG 16, apply triggers on each partition or use event-driven inserts from application layer
