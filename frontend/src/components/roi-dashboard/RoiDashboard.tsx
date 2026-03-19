import { useRoi } from '@/hooks/useDashboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function RoiDashboard() {
  const { data: roi, isLoading } = useRoi();

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading ROI data...</div>;
  if (!roi) return null;

  const topCards = [
    { label: 'Fraud Detected', value: roi.totalFraudDetected, color: 'text-red-400' },
    { label: 'Recovery', value: roi.totalRecovery, color: 'text-green-400' },
    { label: 'Penalties Avoided', value: roi.totalPenaltiesAvoided, color: 'text-yellow-400' },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-100">ROI Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Return on investment metrics and reviewer productivity analysis</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {topCards.map((card) => (
          <div key={card.label} className="card">
            <span className="text-[10px] text-gray-500 uppercase">{card.label}</span>
            <span className={`text-2xl font-bold ${card.color}`}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* Reviewer Productivity */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card">
          <h2 className="text-sm font-medium text-gray-300 mb-3">Reviewer Hours — Before AI</h2>
          <div className="text-3xl font-bold text-gray-400">{roi.totalHoursBefore.toLocaleString()}h</div>
          <div className="text-[10px] text-gray-600 mt-1">Total reviewer hours (manual process)</div>
        </div>
        <div className="card">
          <h2 className="text-sm font-medium text-gray-300 mb-3">Reviewer Hours — After AI</h2>
          <div className="text-3xl font-bold text-green-400">{roi.totalHoursAfter.toLocaleString()}h</div>
          <div className="text-[10px] text-gray-600 mt-1">
            <span className="text-cyan-400 font-semibold">{roi.totalHoursSaved.toLocaleString()}h saved</span> ({((roi.totalHoursSaved / roi.totalHoursBefore) * 100).toFixed(0)}% reduction)
          </div>
        </div>
      </div>

      {/* Monthly Detection Trend Chart */}
      <div className="card mb-6">
        <h2 className="text-sm font-medium text-gray-300 mb-4">Monthly Detection Trend</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roi.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 10 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '8px', fontSize: '12px' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="alertsProcessed" fill="#00F0FF" radius={[4, 4, 0, 0]} name="Alerts Processed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hours Saved Summary */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-300 mb-2">Total Hours Saved</h2>
        <div className="text-4xl font-bold text-cyan-400">{roi.totalHoursSaved.toLocaleString()}</div>
        <div className="text-xs text-gray-500 mt-1">Hours saved through AI-powered auto-triage and disposition</div>
      </div>
    </div>
  );
}
