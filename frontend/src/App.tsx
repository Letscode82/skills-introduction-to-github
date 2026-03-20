import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import CommandCenter from './components/command-center/CommandCenter';
import ProactiveAlerts from './components/proactive-alerts/ProactiveAlerts';
import Investigations from './components/investigations/Investigations';
import EntityHeatmap from './components/entity-heatmap/EntityHeatmap';
import AutoLearn from './components/auto-learn/AutoLearn';
import WarRoom from './components/war-room/WarRoom';
import ExecutiveBriefing from './components/executive-briefing/ExecutiveBriefing';
import RoiDashboard from './components/roi-dashboard/RoiDashboard';

const NAV_ITEMS = [
  { path: '/', label: 'Command Center', icon: '⌘' },
  { path: '/proactive', label: 'Proactive Alerts', icon: '⚡' },
  { path: '/investigations', label: 'Investigations', icon: '🔍' },
  { path: '/entities', label: 'Entity Heatmap', icon: '▦' },
  { path: '/learn', label: 'Auto-Learn', icon: '◎' },
  { path: '/war-room', label: 'War Room', icon: '◈' },
  { path: '/briefing', label: 'Executive Briefing', icon: '📊' },
  { path: '/roi', label: 'ROI Dashboard', icon: '💰' },
] as const;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-56'
        } bg-sentinel-surface border-r border-sentinel-border flex flex-col transition-all duration-200`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sentinel-border flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm flex-shrink-0">
            S
          </div>
          {!sidebarCollapsed && (
            <div>
              <div className="text-sm font-semibold text-cyan-400">SENTINEL AI</div>
              <div className="text-[10px] text-gray-500">v5.0 • Integrity OS</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                location.pathname === item.path
                  ? 'text-cyan-400 bg-cyan-500/10 border-r-2 border-cyan-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-4 border-t border-sentinel-border text-gray-500 hover:text-gray-300 text-xs"
        >
          {sidebarCollapsed ? '→' : '← Collapse'}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-sentinel-bg">
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/proactive" element={<ProactiveAlerts />} />
          <Route path="/investigations" element={<Investigations />} />
          <Route path="/entities" element={<EntityHeatmap />} />
          <Route path="/learn" element={<AutoLearn />} />
          <Route path="/war-room" element={<WarRoom />} />
          <Route path="/briefing" element={<ExecutiveBriefing />} />
          <Route path="/roi" element={<RoiDashboard />} />
        </Routes>
      </main>
    </div>
  );
}
