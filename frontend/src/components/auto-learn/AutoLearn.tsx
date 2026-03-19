import { useLearningStats } from '@/hooks/useDashboard';
import { useAutoDisposed, useApproveAutoDisposition, useOverrideAutoDisposition } from '@/hooks/useAlerts';
import { severityColor, formatRelativeTime, riskScoreColor } from '@/utils/format';

export default function AutoLearn() {
  const { data: stats, isLoading: statsLoading } = useLearningStats();
  const { data: autoDisposedPage, isLoading: queueLoading } = useAutoDisposed();
  const approveMutation = useApproveAutoDisposition();
  const overrideMutation = useOverrideAutoDisposition();

  const queue = autoDisposedPage?.content ?? [];

  const statCards = stats ? [
    { label: 'Total Auto-Disposed', value: stats.totalAutoDisposed, color: 'text-cyan-400' },
    { label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-green-400' },
    { label: 'Overrides', value: stats.overrides, color: 'text-yellow-400' },
    { label: 'False Negatives', value: stats.falseNegatives, color: 'text-red-400' },
    { label: 'Hours Saved', value: stats.hoursSaved, color: 'text-purple-400' },
    { label: 'Rules Calibrated', value: stats.rulesCalibrated, color: 'text-cyan-400' },
  ] : [];

  if (statsLoading) return <div className="p-6 text-sm text-gray-500">Loading learning data...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">Auto-Learn Engine</h1>
        <p className="text-sm text-gray-500 mt-1">AI learning performance, rule calibration, and auto-disposition review</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="stat-card">
            <span className="text-[10px] text-gray-500 uppercase">{stat.label}</span>
            <span className={`text-xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Auto-Disposed Queue */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-300 mb-4">Auto-Disposed Alert Review Queue</h2>
        {queueLoading ? (
          <div className="text-sm text-gray-500">Loading queue...</div>
        ) : queue.length === 0 ? (
          <div className="text-sm text-gray-500">No alerts pending review.</div>
        ) : (
          <div className="space-y-2">
            {queue.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-sentinel-bg rounded-lg border border-sentinel-border">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: riskScoreColor(alert.riskScore) + '20', color: riskScoreColor(alert.riskScore) }}
                  >
                    {alert.riskScore}
                  </div>
                  <div>
                    <div className="text-sm text-gray-200">{alert.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] ${severityColor(alert.severity)}`}>{alert.severity}</span>
                      <span className="text-[10px] text-gray-600">{alert.entityCode}</span>
                      <span className="text-[10px] text-gray-600">{formatRelativeTime(alert.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => approveMutation.mutate(alert.id)}
                    disabled={approveMutation.isPending}
                    className="btn-success text-xs"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => overrideMutation.mutate(alert.id)}
                    disabled={overrideMutation.isPending}
                    className="btn-danger text-xs"
                  >
                    Override
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
