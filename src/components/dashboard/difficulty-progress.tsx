import { cn } from '@/lib/utils';

interface DifficultyProgressProps {
  solved: number;
  total: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const config = {
  Easy: { color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', label: 'Easy' },
  Medium: { color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400', label: 'Medium' },
  Hard: { color: 'bg-rose-500', textColor: 'text-rose-600 dark:text-rose-400', label: 'Hard' },
};

export function DifficultyProgress({ solved, total, difficulty }: DifficultyProgressProps) {
  const c = config[difficulty];
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className={cn('font-medium', c.textColor)}>{c.label}</span>
        <span className="text-muted-foreground tabular-nums">
          {solved} <span className="text-xs">/ {total}</span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', c.color)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">{pct}%</p>
    </div>
  );
}
