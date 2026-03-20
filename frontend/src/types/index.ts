export type Module = 'p2p' | 'tne' | 'loans' | 'insurance';

export type Severity = 'critical' | 'elevated' | 'moderate';

export type AlertStatus =
  | 'pending'
  | 'triaging'
  | 'triaged'
  | 'auto_disposed'
  | 'escalated'
  | 'investigating'
  | 'closed';

export type InvestigationStatus = 'open' | 'under_review' | 'escalated' | 'closed';

export type TriageStageStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

export type GraphNodeType =
  | 'vendor'
  | 'director'
  | 'employee'
  | 'entity'
  | 'shell'
  | 'bank'
  | 'regulator'
  | 'system';

export interface Alert {
  id: string;
  alertNumber: string;
  module: Module;
  entityCode: string;
  entityName: string;
  title: string;
  description: string;
  riskScore: number;
  severity: Severity;
  status: AlertStatus;
  vendorName: string;
  vendorId: string;
  amountPaise: number;
  amountFormatted: string;
  mlConfidence: number;
  autoDisposed: boolean;
  autoDisposedAt: string | null;
  autoDispositionApproved: boolean | null;
  assignedTo: string;
  triageStartedAt: string | null;
  triageCompletedAt: string | null;
  triageStages: TriageStage[];
  createdAt: string;
}

export interface TriageStage {
  id: string;
  stageNumber: number;
  stageName: string;
  status: TriageStageStatus;
  agentName: string;
  confidence: number | null;
  durationMs: number | null;
  startedAt: string | null;
  completedAt: string | null;
}

export interface AbgEntity {
  id: string;
  code: string;
  name: string;
  riskScore: number;
  severity: Severity;
  totalAlerts: number;
  criticalAlerts: number;
  autoDisposedCount: number;
  activeInvestigations: number;
}

export interface Investigation {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  module: Module;
  entityCode: string;
  entityName: string;
  status: InvestigationStatus;
  priority: Severity;
  assignedTo: string;
  totalAmountPaise: number;
  totalAmountFormatted: string;
  progressPct: number;
  findings: string;
  recommendation: string;
  actions: InvestigationAction[];
  createdAt: string;
}

export interface InvestigationAction {
  id: string;
  actionType: string;
  description: string;
  actor: string;
  createdAt: string;
}

export interface ProactiveAlert {
  id: string;
  title: string;
  description: string;
  module: Module | null;
  entityCode: string | null;
  severity: Severity;
  isRead: boolean;
  createdAt: string;
}

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  properties: Record<string, unknown>;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  type: string;
  label: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface WarRoom {
  alertsToday: number;
  aiTriagedToday: number;
  activeCritical: number;
  activeInvestigations: number;
  entityRiskPulse: AbgEntity[];
}

export interface RoiData {
  totalFraudDetected: string;
  totalRecovery: string;
  totalPenaltiesAvoided: string;
  totalHoursBefore: number;
  totalHoursAfter: number;
  totalHoursSaved: number;
  monthlyTrend: MonthlyRoi[];
}

export interface MonthlyRoi {
  month: string;
  fraudDetected: string;
  recovery: string;
  alertsProcessed: number;
  hoursBefore?: number;
  hoursAfter?: number;
}

export interface LearningStats {
  totalAutoDisposed: number;
  accuracy: number;
  overrides: number;
  falseNegatives: number;
  hoursSaved: number;
  rulesCalibrated: number;
}

export interface ModuleDefinition {
  code: Module;
  name: string;
  description: string;
  totalRules: number;
  triageStages: string[];
}

export interface HealthStatus {
  status: string;
  version: string;
  modules: Record<string, string>;
  services: Record<string, string>;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CopilotRequest {
  alertId?: string;
  investigationId?: string;
  outputType: 'memo' | 'email' | 'block_order' | 'agenda';
  prompt?: string;
  context?: string;
}

export interface CopilotResponse {
  id: string;
  outputType: string;
  content: string;
  tokensUsed: number;
}

export const MODULE_LABELS: Record<Module, string> = {
  p2p: 'P2P Procurement',
  tne: 'Travel & Expense',
  loans: 'Loans & Advances',
  insurance: 'Insurance Claims',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  critical: '#EF4444',
  elevated: '#FBBF24',
  moderate: '#22C55E',
};

export const NODE_COLORS: Record<GraphNodeType, string> = {
  vendor: '#00F0FF',
  director: '#F472B6',
  employee: '#FBBF24',
  entity: '#818CF8',
  shell: '#EF4444',
  bank: '#FB923C',
  regulator: '#EF4444',
  system: '#A78BFA',
};
