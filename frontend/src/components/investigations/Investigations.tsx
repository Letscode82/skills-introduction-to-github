import { useState } from 'react';
import { useInvestigations } from '@/hooks/useDashboard';
import { severityColor, severityBg, formatRelativeTime } from '@/utils/format';
import { MODULE_LABELS } from '@/types';
import type { Module, InvestigationStatus } from '@/types';

const STATUS_FILTERS: { label: string; value: InvestigationStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Under Review', value: 'under_review' },
  { label: 'Escalated', value: 'escalated' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
];

export default function Investigations() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, isLoading } = useInvestigations({
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const investigations = data?.content ?? [];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">Investigation Cases</h1>
        <p className="text-sm text-gray-500 mt-1">Active fraud investigations across all entities</p>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`btn text-xs ${
              statusFilter === filter.value
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-gray-500 border border-sentinel-border hover:text-gray-300'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-sm text-gray-500">Loading investigations...</div>
      ) : investigations.length === 0 ? (
        <div className="text-sm text-gray-500">No investigations found.</div>
      ) : (
        <div className="space-y-3">
          {investigations.map((inv) => (
            <div key={inv.id} className="card hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500 font-mono">{inv.caseNumber}</span>
                    <span className={`badge ${severityBg(inv.priority)} ${severityColor(inv.priority)}`}>
                      {inv.priority}
                    </span>
                    <span className="badge-module">{MODULE_LABELS[inv.module as Module] ?? inv.module}</span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-200 mb-1">{inv.title}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{inv.entityCode} • {inv.entityName}</span>
                    <span>Assigned: {inv.assignedTo || 'Unassigned'}</span>
                    <span>{formatRelativeTime(inv.createdAt)}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-sm text-gray-300">{inv.totalAmountFormatted}</div>
                  <div className={`text-xs mt-1 ${
                    inv.status === 'escalated' ? 'text-red-400' :
                    inv.status === 'under_review' ? 'text-yellow-400' :
                    inv.status === 'closed' ? 'text-gray-500' : 'text-green-400'
                  }`}>
                    {inv.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{inv.progressPct}%</span>
                </div>
                <div className="w-full h-1.5 bg-sentinel-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 rounded-full transition-all"
                    style={{ width: `${inv.progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
