export type SeverityType = 'ok' | 'underpaid' | 'needs-review' | 'overpaid';

interface SeverityBadgeProps {
  severity: SeverityType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

const severityConfig: Record<SeverityType, {
  label: string;
  className: string;
}> = {
  'ok': {
    label: 'OK',
    className: 'bg-green-100 text-green-800 border-green-300'
  },
  'underpaid': {
    label: 'Underpaid',
    className: 'bg-red-100 text-red-800 border-red-300'
  },
  'needs-review': {
    label: 'Needs Review',
    className: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  'overpaid': {
    label: 'Overpaid',
    className: 'bg-purple-100 text-purple-800 border-purple-300'
  }
};

export function SeverityBadge({ severity, label, size = 'md' }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  return (
    <span className={`inline-flex items-center rounded-md border ${config.className} ${sizeClasses[size]}`}>
      {label || config.label}
    </span>
  );
}
