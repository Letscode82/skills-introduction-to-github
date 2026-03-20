import { useEntities } from '@/hooks/useDashboard';
import { riskScoreColor } from '@/utils/format';

export default function EntityHeatmap() {
  const { data: entities, isLoading } = useEntities();

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading entities...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">Entity Risk Heatmap</h1>
        <p className="text-sm text-gray-500 mt-1">Risk overview across all 10 Aditya Birla Group entities</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {(entities ?? []).map((entity) => {
          const color = riskScoreColor(entity.riskScore);
          return (
            <div
              key={entity.id}
              className="card hover:scale-[1.02] transition-all cursor-pointer"
              style={{ borderColor: color + '40' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-200">{entity.code}</span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: color + '20', color }}
                >
                  {entity.riskScore}
                </div>
              </div>
              <div className="text-[10px] text-gray-500 mb-3 truncate">{entity.name}</div>

              {/* Risk bar */}
              <div className="w-full h-2 bg-sentinel-bg rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${entity.riskScore}%`, backgroundColor: color }}
                />
              </div>

              <div className="grid grid-cols-3 gap-1 text-center">
                <div>
                  <div className="text-xs font-semibold text-gray-200">{entity.totalAlerts}</div>
                  <div className="text-[9px] text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-red-400">{entity.criticalAlerts}</div>
                  <div className="text-[9px] text-gray-600">Critical</div>
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-400">{entity.autoDisposedCount}</div>
                  <div className="text-[9px] text-gray-600">Auto</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
