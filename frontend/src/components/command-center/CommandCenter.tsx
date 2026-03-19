import { useState } from 'react';
import { useAlerts, useAlert } from '@/hooks/useAlerts';
import { useModules } from '@/hooks/useDashboard';
import { severityColor, severityBg, riskScoreColor, formatRelativeTime } from '@/utils/format';
import type { Module, Alert, TriageStage } from '@/types';
import { MODULE_LABELS } from '@/types';

const EVIDENCE_TABS = ['Summary', 'Ask', 'Emails', 'Graph', 'Timeline', 'Flags', 'TPRM/Emp', 'COI', 'Txns', 'Copilot'] as const;

function StageIndicator({ stage }: { stage: TriageStage }) {
  const statusIcon = {
    completed: '✓',
    running: '◉',
    pending: '○',
    failed: '✗',
    skipped: '—',
  }[stage.status];

  const statusColor = {
    completed: 'text-green-400',
    running: 'text-cyan-400 animate-pulse',
    pending: 'text-gray-600',
    failed: 'text-red-400',
    skipped: 'text-gray-600',
  }[stage.status];

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-white/5">
      <span className={`text-xs font-mono ${statusColor}`}>{statusIcon}</span>
      <span className="text-xs text-gray-400 w-4">{stage.stageNumber}</span>
      <span className={`text-xs ${stage.status === 'running' ? 'text-cyan-400' : 'text-gray-300'}`}>
        {stage.stageName}
      </span>
      {stage.durationMs !== null && (
        <span className="text-[10px] text-gray-600 ml-auto">{stage.durationMs}ms</span>
      )}
    </div>
  );
}

function AlertRow({ alert, isSelected, onSelect }: { alert: Alert; isSelected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-4 py-3 border-b border-sentinel-border cursor-pointer transition-colors ${
        isSelected ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400' : 'hover:bg-white/5'
      }`}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
        style={{ backgroundColor: riskScoreColor(alert.riskScore) + '20', color: riskScoreColor(alert.riskScore) }}
      >
        {alert.riskScore}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-200 truncate">{alert.title}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] ${severityColor(alert.severity)}`}>{alert.severity.toUpperCase()}</span>
          <span className="text-[10px] text-gray-600">•</span>
          <span className="text-[10px] text-gray-500">{alert.vendorName || alert.alertNumber}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">{alert.amountFormatted}</div>
        <div className="text-[10px] text-gray-600">{formatRelativeTime(alert.createdAt)}</div>
      </div>
    </div>
  );
}

export default function CommandCenter() {
  const [activeModule, setActiveModule] = useState<Module>('p2p');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Summary');

  const { data: alertsPage, isLoading } = useAlerts({ module: activeModule });
  const { data: selectedAlert } = useAlert(selectedAlertId);
  const { data: modules } = useModules();

  const alerts = alertsPage?.content ?? [];

  return (
    <div className="flex h-full">
      {/* Left Panel: Module Tabs + Alert Queue */}
      <div className="w-96 border-r border-sentinel-border flex flex-col">
        {/* Module Tabs */}
        <div className="flex border-b border-sentinel-border">
          {(['p2p', 'tne', 'loans', 'insurance'] as Module[]).map((mod) => (
            <button
              key={mod}
              onClick={() => { setActiveModule(mod); setSelectedAlertId(null); }}
              className={`flex-1 py-3 text-xs font-medium transition-colors ${
                activeModule === mod
                  ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {mod.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Alert Queue */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-gray-500">Loading alerts...</div>
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-sm text-gray-500">No alerts for {MODULE_LABELS[activeModule]}</div>
            </div>
          ) : (
            alerts.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
                isSelected={selectedAlertId === alert.id}
                onSelect={() => setSelectedAlertId(alert.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Middle Panel: Triage Pipeline */}
      {selectedAlert && (
        <div className="w-64 border-r border-sentinel-border flex flex-col">
          <div className="p-3 border-b border-sentinel-border">
            <div className="text-xs text-gray-500 mb-1">TRIAGE PIPELINE</div>
            <div className="text-sm text-gray-200">{selectedAlert.alertNumber}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {selectedAlert.triageStages.length > 0 ? (
              selectedAlert.triageStages.map((stage) => (
                <StageIndicator key={stage.id} stage={stage} />
              ))
            ) : (
              <div className="text-xs text-gray-600 p-2">
                {modules?.find((m) => m.code === activeModule)?.triageStages.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 py-1.5">
                    <span className="text-gray-600">○</span>
                    <span className="text-gray-500 w-4">{i + 1}</span>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right Panel: Evidence */}
      <div className="flex-1 flex flex-col">
        {selectedAlert ? (
          <>
            {/* Alert Header */}
            <div className="p-4 border-b border-sentinel-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg text-gray-100">{selectedAlert.title}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`badge ${severityBg(selectedAlert.severity)} ${severityColor(selectedAlert.severity)}`}>
                      {selectedAlert.severity}
                    </span>
                    <span className="badge-module">{selectedAlert.entityCode}</span>
                    <span className="text-xs text-gray-500">{selectedAlert.alertNumber}</span>
                  </div>
                </div>
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold glow-cyan"
                  style={{ backgroundColor: riskScoreColor(selectedAlert.riskScore) + '20', color: riskScoreColor(selectedAlert.riskScore) }}
                >
                  {selectedAlert.riskScore}
                </div>
              </div>
            </div>

            {/* Evidence Tabs */}
            <div className="flex border-b border-sentinel-border overflow-x-auto">
              {EVIDENCE_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Evidence Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'Summary' && (
                <div className="space-y-4">
                  <div className="card">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Alert Summary</h3>
                    <p className="text-sm text-gray-400">{selectedAlert.description || 'No description available.'}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="stat-card">
                      <span className="text-[10px] text-gray-500 uppercase">Vendor</span>
                      <span className="text-sm text-gray-200">{selectedAlert.vendorName || 'N/A'}</span>
                    </div>
                    <div className="stat-card">
                      <span className="text-[10px] text-gray-500 uppercase">Amount</span>
                      <span className="text-sm text-gray-200">{selectedAlert.amountFormatted}</span>
                    </div>
                    <div className="stat-card">
                      <span className="text-[10px] text-gray-500 uppercase">ML Confidence</span>
                      <span className="text-sm text-gray-200">
                        {selectedAlert.mlConfidence ? `${(selectedAlert.mlConfidence * 100).toFixed(1)}%` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Status</h3>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${severityBg(selectedAlert.severity)}`}>{selectedAlert.status}</span>
                      {selectedAlert.autoDisposed && (
                        <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">Auto-Disposed</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'Ask' && (
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Ask about this alert</h3>
                  <textarea
                    className="w-full bg-sentinel-bg border border-sentinel-border rounded p-3 text-sm text-gray-300 resize-none h-24 focus:outline-none focus:border-cyan-500/50"
                    placeholder="Ask a question about this alert..."
                  />
                  <button className="btn-primary mt-2">Ask Sentinel AI</button>
                </div>
              )}
              {activeTab === 'Copilot' && (
                <div className="space-y-3">
                  <div className="card">
                    <h3 className="text-sm font-medium text-gray-300 mb-3">AI Copilot</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {(['memo', 'email', 'block_order', 'agenda'] as const).map((type) => (
                        <button key={type} className="btn-primary text-xs">
                          Generate {type.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {!['Summary', 'Ask', 'Copilot'].includes(activeTab) && (
                <div className="flex items-center justify-center h-48 text-gray-600 text-sm">
                  {activeTab} data will load from API
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            <div className="text-center">
              <div className="text-4xl mb-3">⌘</div>
              <div className="text-sm">Select an alert to begin triage</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
