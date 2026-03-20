export function formatPaise(paise: number): string {
  if (!paise) return '₹0';
  return '₹' + (paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatCrore(paise: number): string {
  const crore = paise / 10000000;
  return '₹' + crore.toFixed(2) + ' Cr';
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN');
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400';
    case 'elevated': return 'text-yellow-400';
    case 'moderate': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

export function severityBg(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 border-red-500/30';
    case 'elevated': return 'bg-yellow-500/20 border-yellow-500/30';
    case 'moderate': return 'bg-green-500/20 border-green-500/30';
    default: return 'bg-gray-500/20 border-gray-500/30';
  }
}

export function riskScoreColor(score: number): string {
  if (score >= 75) return '#EF4444';
  if (score >= 50) return '#FBBF24';
  return '#22C55E';
}
