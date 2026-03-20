import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  glow?: boolean;
  className?: string;
}

export default function StatCard({ label, value, color = 'text-cyan-400', glow, className }: StatCardProps) {
  return (
    <div className={clsx('stat-card', glow && 'glow-cyan', className)}>
      <span className="text-[10px] text-gray-500 uppercase tracking-wider">{label}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
