interface AnomalyScorePillProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-red-100 text-red-800 border-red-300';
  if (score >= 60) return 'bg-orange-100 text-orange-800 border-orange-300';
  if (score >= 40) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (score >= 20) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-green-100 text-green-800 border-green-300';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  if (score >= 20) return 'Low';
  return 'Minimal';
}

export function AnomalyScorePill({ score, size = 'md', showLabel = true }: AnomalyScorePillProps) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const colorClass = getScoreColor(clampedScore);
  const label = getScoreLabel(clampedScore);
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <div className="inline-flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 rounded-full border ${colorClass} ${sizeClasses[size]}`}>
        <span className="font-medium">{clampedScore}</span>
        {showLabel && <span className="text-xs opacity-75">/ 100</span>}
      </span>
      {showLabel && (
        <span className="text-sm text-muted-foreground">{label} Risk</span>
      )}
    </div>
  );
}
