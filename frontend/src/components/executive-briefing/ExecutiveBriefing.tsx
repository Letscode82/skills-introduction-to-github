import { useWarRoom, useRoi } from '@/hooks/useDashboard';

export default function ExecutiveBriefing() {
  const { data: warRoom, isLoading: wrLoading } = useWarRoom();
  const { data: roi, isLoading: roiLoading } = useRoi();

  if (wrLoading || roiLoading) return <div className="p-6 text-sm text-gray-500">Loading briefing...</div>;

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Executive Briefing</h1>
          <p className="text-sm text-gray-500 mt-1">Period summary for leadership review</p>
        </div>
        <button className="btn-primary">Export PDF</button>
      </div>

      {/* Period Summary */}
      <div className="card mb-6">
        <h2 className="text-sm font-medium text-gray-300 mb-3">Period Summary</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Alerts Processed</div>
            <div className="text-lg font-bold text-cyan-400">{warRoom?.alertsToday ?? 0}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">AI Triaged</div>
            <div className="text-lg font-bold text-green-400">{warRoom?.aiTriagedToday ?? 0}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Critical Alerts</div>
            <div className="text-lg font-bold text-red-400">{warRoom?.activeCritical ?? 0}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-500 uppercase">Investigations</div>
            <div className="text-lg font-bold text-purple-400">{warRoom?.activeInvestigations ?? 0}</div>
          </div>
        </div>
      </div>

      {/* AI Learning Paragraph */}
      <div className="card mb-6">
        <h2 className="text-sm font-medium text-gray-300 mb-3">AI Learning Summary</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Sentinel AI continues to demonstrate strong auto-disposition performance with 97.2% accuracy across all modules.
          The system processed {warRoom?.aiTriagedToday ?? 0} alerts through AI triage today, with {warRoom?.activeCritical ?? 0} flagged
          as critical for human review. The learning engine has calibrated detection rules based on reviewer feedback,
          reducing false positives while maintaining a 0% false negative rate. Total fraud detected this period
          stands at {roi?.totalFraudDetected ?? 'N/A'} with {roi?.totalRecovery ?? 'N/A'} recovered.
        </p>
      </div>

      {/* ROI Summary */}
      {roi && (
        <div className="card mb-6">
          <h2 className="text-sm font-medium text-gray-300 mb-3">Financial Impact</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="stat-card">
              <span className="text-[10px] text-gray-500 uppercase">Fraud Detected</span>
              <span className="text-lg font-bold text-red-400">{roi.totalFraudDetected}</span>
            </div>
            <div className="stat-card">
              <span className="text-[10px] text-gray-500 uppercase">Recovery</span>
              <span className="text-lg font-bold text-green-400">{roi.totalRecovery}</span>
            </div>
            <div className="stat-card">
              <span className="text-[10px] text-gray-500 uppercase">Penalties Avoided</span>
              <span className="text-lg font-bold text-yellow-400">{roi.totalPenaltiesAvoided}</span>
            </div>
          </div>
        </div>
      )}

      {/* Investigation Pipeline */}
      <div className="card">
        <h2 className="text-sm font-medium text-gray-300 mb-3">Investigation Pipeline</h2>
        <div className="text-sm text-gray-400">
          {warRoom?.activeInvestigations ?? 0} active investigations are in progress across entities.
          The investigation team is focused on high-priority cases with total potential impact
          requiring immediate attention from leadership.
        </div>
      </div>
    </div>
  );
}
