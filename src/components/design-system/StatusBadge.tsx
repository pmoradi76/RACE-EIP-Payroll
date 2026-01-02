import { LucideIcon } from 'lucide-react';
import { CheckCircle2, Loader2, AlertCircle, XCircle, Clock } from 'lucide-react';

export type StatusType = 'done' | 'running' | 'needs-review' | 'failed' | 'pending';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, {
  label: string;
  icon: LucideIcon;
  className: string;
}> = {
  'done': {
    label: 'Done',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200'
  },
  'running': {
    label: 'Running',
    icon: Loader2,
    className: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'needs-review': {
    label: 'Needs Review',
    icon: AlertCircle,
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'failed': {
    label: 'Failed',
    icon: XCircle,
    className: 'bg-red-50 text-red-700 border-red-200'
  },
  'pending': {
    label: 'Pending',
    icon: Clock,
    className: 'bg-gray-50 text-gray-700 border-gray-200'
  }
};

export function StatusBadge({ status, label, size = 'md', showIcon = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  const iconSizes = {
    sm: 'size-3',
    md: 'size-3.5',
    lg: 'size-4'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.className} ${sizeClasses[size]}`}>
      {showIcon && (
        <Icon className={`${iconSizes[size]} ${status === 'running' ? 'animate-spin' : ''}`} />
      )}
      {label || config.label}
    </span>
  );
}
