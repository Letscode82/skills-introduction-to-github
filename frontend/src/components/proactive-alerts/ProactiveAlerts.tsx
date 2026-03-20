import { useProactiveAlerts } from '@/hooks/useDashboard';
import { severityColor, severityBg, formatRelativeTime } from '@/utils/format';
import { MODULE_LABELS } from '@/types';
import type { Module } from '@/types';

export default function ProactiveAlerts() {
  const { data, isLoading } = useProactiveAlerts();
  const alerts = data?.content ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">Proactive AI Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">AI-detected anomalies and emerging risk patterns across all modules</p>
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading proactive alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="text-sm text-gray-500">No proactive alerts at this time.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`card border ${severityBg(alert.severity)} transition-all hover:scale-[1.01]`}>
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${severityBg(alert.severity)} ${severityColor(alert.severity)}`}>
                  {alert.severity.toUpperCase()}
                </span>
                <span className="text-[10px] text-gray-500">{formatRelativeTime(alert.createdAt)}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-200 mb-2">{alert.title}</h3>
              <p className="text-xs text-gray-400 mb-3 line-clamp-3">{alert.description}</p>
              <div className="flex items-center gap-2">
                {alert.module && (
                  <span className="badge-module">{MODULE_LABELS[alert.module as Module] ?? alert.module}</span>
                )}
                {alert.entityCode && (
                  <span className="badge bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {alert.entityCode}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
