import { severityColor, severityBg } from '@/utils/format';

interface SeverityBadgeProps {
  severity: string;
  className?: string;
}

export default function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  return (
    <span className={`badge ${severityBg(severity)} ${severityColor(severity)} ${className ?? ''}`}>
      {severity.toUpperCase()}
    </span>
  );
}
