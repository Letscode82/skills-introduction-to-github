import { useWarRoom } from '@/hooks/useDashboard';
import { riskScoreColor } from '@/utils/format';

export default function WarRoom() {
  const { data, isLoading } = useWarRoom();

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading war room...</div>;
  if (!data) return null;

  const topStats = [
    { label: 'Alerts Today', value: data.alertsToday, color: 'text-cyan-400', glow: 'glow-cyan' },
    { label: 'AI Triaged', value: data.aiTriagedToday, color: 'text-green-400', glow: '' },
    { label: 'Active Critical', value: data.activeCritical, color: 'text-red-400', glow: 'glow-red' },
    { label: 'Active Investigations', value: data.activeInvestigations, color: 'text-purple-400', glow: '' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">War Room</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time operational dashboard — live monitoring across all modules</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {topStats.map((stat) => (
          <div key={stat.label} className={`card ${stat.glow}`}>
            <span className="text-[10px] text-gray-500 uppercase">{stat.label}</span>
            <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Entity Risk Pulse */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-300 mb-4">Entity Risk Pulse</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {data.entityRiskPulse.map((entity) => {
            const color = riskScoreColor(entity.riskScore);
            return (
              <div key={entity.id} className="p-3 bg-sentinel-bg rounded-lg border border-sentinel-border text-center">
                <div className="text-xs font-bold text-gray-300 mb-1">{entity.code}</div>
                <div className="text-2xl font-bold mb-1" style={{ color }}>{entity.riskScore}</div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${entity.riskScore}%`, backgroundColor: color }} />
                </div>
                <div className="text-[9px] text-gray-600 mt-1">{entity.totalAlerts} alerts</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
